import fs from "fs/promises";
import path from "path";

const RAW_INPUT_PATH = new URL('./data/export.json', import.meta.url);
const OUTPUT = path.resolve("public/stations.json");

const DEDUPE_DISTANCE_METERS = 250;

//haversine distance function
function haversineMeters(lat1, lng1, lat2, lng2){
  const R = 637100; //in meters
  const toRad = (deg) => (deg * Math.PI) / 180; 

  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const latDiff = toRad(lat1 - lat2); 
  const longDiff = toRad(lng1 - lng2); 

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(longDiff / 2) * Math.sin(longDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
//get coords
function getCoords(el){
  if (typeof el.lat === "number" && typeof el.lon === "number"){   
    return{ lat: el.lat, lng: el.lon };   
  }
  if(
    el.center && 
    typeof el.center.lat === "number" && typeof el.center.lon === "number"
  ){
    return { lat: el.center.lat, lng: el.center.lon };
  }  

  return null; 
}

//get stable id
function getStableId(el, tags){
  if(typeof tags.wikidata === "string" && typeof tags.wikidata.trim() !== ""){
    return tags.wikidata.trim();
  }
  return `${el.type}/${el.id}`;
  
}
//score candidates based on quality of tags
function scoreCandidate(c){
  let score = 0; 

  if (c._osmType === "relation") score += 3; 
  if (c._osmType === "way") score += 2; 
  if (c._osmType === "node") score += 1; 

  if (c.name_en) score += 2; 

  if (c.operator) score += 1;
  
  if (c._hasWikidata) score += 3;

  return score; 
}
//merge stations keeping the best fields
function mergeStations(a, b){
  const aScore = scoreCandidate(a)
  const bScore = scoreCandidate(b)

  const winner = bScore > aScore ? b : a; 
  const loser = winner === b ? a : b; 

  if(!winner.name_en && loser.name_en) winner.name_en = loser.name_en; 

  if (
    typeof winner.lat !== "number" || typeof winner.lng !== "number" &&
    typeof loser.lat === "number" && typeof loser.lng === "number"
  ){
    winner.lat = loser.lat
    winner.lng = loser.lng
  }
   
  return winner
}

async function main() {
  const rawText = await fs.readFile(RAW_INPUT_PATH, 'utf8');
  const raw = JSON.parse(rawText);

  const elements = Array.isArray(raw.elements) ? raw.elements : [];  
  console.log(`Raw elements: ${elements.length}`);

    //build caandidate station list 
  const candidates = []; 
  let droppedNoName = 0;
  let droppedNoCoords = 0;    
  let droppedNoQuality = 0;

  for (const el of elements) {
    const tags = el.tags ?? {};
    const nameJa = tags.name; 

    if (typeof nameJa !== 'string' || nameJa.trim() === "") {
      droppedNoName++;
      continue;
    }

    const coords = getCoords(el);
    if(!coords) {
      droppedNoCoords++;
      continue;
    }

    const station = {
      id: getStableId(el, tags),
      name_ja: nameJa.trim(),
      name_en: 
        typeof tags['name:en'] === 'string' && tags['name:en'].trim() !== "" ? tags['name:en'].trim() : null,
      lat: coords.lat,
      lng: coords.lng,

      _osmType: el.type,
      _operator: 
        typeof tags.operator === 'string' && tags.operator.trim() !== "" ? tags.operator.trim() : null,
      _hasWikidata: 
        typeof tags.wikidata === 'string' && tags.wikidata.trim() !== "" ? tags.wikidata.trim() : null,
    
    };
    
    candidates.push(station);     
  }

  console.log(
    `Candidates: ${candidates.length} (dropped no name: ${droppedNoName}, dropped no coords: ${droppedNoCoords})`
  );

  //dedupe by WikiData ID
  const byWikidata = new Map(); 
  const withoutWikidata = [];

  let mergedByWikidata = 0;

  for (const c of candidates){
    const isWikidataID = c._hasWikidata && typeof c.id === "string" && c.id.startsWith("Q");
    if(!isWikidataID) {
      withoutWikidata.push(c);
      continue;
    }
    const existing= byWikidata.get(c.id);
    if(!existing){
      byWikidata.set(c.id, c);
      
    }
    else{
      const merged = mergeStations(existing, c);
      byWikidata.set(c.id, merged)
      mergedByWikidata++;
    }

  }

  const afterWikidata = [...byWikidata.values(), ...withoutWikidata]; 

  console.log(
    `After Wikidata merge: ${afterWikidata.length} (merged by wikidata: ${mergedByWikidata})`
  )
  

  //dedupe by name + proximity using haversine distance and bucketing by jpName and merging by best fields
  const buckets = new Map(); 
  for (const s of afterWikidata){
    const key = s.name_ja; 
    if(!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(s);
  }

  let mergedByProximity = 0; 
  const finalStations = [];

  for(const [name, list] of buckets.entries()){
    if (list.length === 1){
      finalStations.push(list[0]);
      continue;
    }
    
    //TODO: greedy merge
    const kept = [];

    for(const s of list){ //
      let mergedIntoExisting = false;
      
      for(let i = 0; i < kept.length; i++){
        const k = kept[i]
        const d = haversineMeters(s.lat, s.lng, k.lat, k.lng)
        if(d <= DEDUPE_DISTANCE_METERS){
          kept[i]= mergeStations(k, s);
          mergedIntoExisting = true;
          mergedByProximity++;
          break;
        }
      }
      
      if(!mergedByProximity) kept.push(s);
    }

    for (const k of kept) finalStations.push(k); 
  } 

  console.log(
    `After proximity merge: ${finalStations.length} (merged by proximity: ${mergedByProximity})`
  );
  

  //strip internal fields + normalize nulls????
  const outputStations = finalStations
    .map((s) => ({
      id: s.id,
      name_ja: s.name_ja,
      ...(s.name_en ? { name_en: s.name_en } : {}),
      lat: s.lat,
      lng: s.lng,
    }))
    // Deterministic ordering helps keep diffs stable when regenerating
    .sort((a, b) => {
      // Primary: name_ja, Secondary: name_en, then lat/lng
      const n = a.name_ja.localeCompare(b.name_ja, "ja");
      if (n !== 0) return n;
      const e = (a.name_en ?? "").localeCompare(b.name_en ?? "", "en");
      if (e !== 0) return e;
      if (a.lat !== b.lat) return a.lat - b.lat;
      return a.lng - b.lng;
    });

  const withEnglish = outputStations.filter((s) => "name_en" in s).length;
  console.log(
    `Output stations: ${outputStations.length} (with name_en: ${withEnglish})`
  );

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(outputStations, null, 2), "utf8");

  console.log(`Wrote: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

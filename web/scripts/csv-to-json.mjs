import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csv = fs.readFileSync('src/data/gym_list.csv', 'utf8');

// Turn each row into an object using the header row as keys
const rows = parse(csv, {
    columns: true,          // use first row as keys
    skip_empty_lines: true,
  });

const gyms = rows.map((row) => ({
name: row.name,
location: row.location,
plusCode: row.plus_code || null,
style: row.style ? row.style.split(',').map(s => s.trim()) : [],
size: Number(row.size),
cost: Number(row.cost),
quality: Number(row.quality),
hangboard: row.hangboard === 'Yes',
campusBoard: row.campus_board === 'Yes',
sprayWall: row.spray_wall === 'Yes',
trainingBoards: row.training_boards ? row.training_boards.split(',').map(s => s.trim()) : [],
notes: row.notes || '',
}));

fs.writeFileSync('src/data/gym_list.json', JSON.stringify(gyms, null, 2));

console.log('Wrote data/gym_list.json with', gyms.length, 'gym_list.csv');

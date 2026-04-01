type LatLng = {
    lat: number
    lng: number
  }
  
  type BuildGoogleMapsUrlArgs = {
    destination: LatLng
    origin?: LatLng | null
  }
  
  export function buildGoogleMapsUrl({
    destination,
    origin,
  }: BuildGoogleMapsUrlArgs): string {
    const base = "https://www.google.com/maps/dir/?api=1"
  
    const destinationParam = `destination=${destination.lat},${destination.lng}`
  
    if (origin) {
      const originParam = `origin=${origin.lat},${origin.lng}`
      return `${base}&${originParam}&${destinationParam}&travelmode=transit`
    }
  
    return `${base}&${destinationParam}&travelmode=transit`
  }
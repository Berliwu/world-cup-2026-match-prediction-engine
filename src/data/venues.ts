export interface Venue {
  id: string;
  name: string;
  city: string;
  country: "USA" | "MEX" | "CAN";
  capacity: number;
  altitude: number;
}

export const VENUES: Venue[] = [
  { id: "metlife", name: "MetLife Stadium", city: "East Rutherford", country: "USA", capacity: 82500, altitude: 3 },
  { id: "sofi", name: "SoFi Stadium", city: "Inglewood", country: "USA", capacity: 70000, altitude: 30 },
  { id: "att", name: "AT&T Stadium", city: "Arlington", country: "USA", capacity: 80000, altitude: 180 },
  { id: "azteca", name: "Estadio Azteca", city: "Mexico City", country: "MEX", capacity: 87000, altitude: 2240 },
  { id: "bbva", name: "Estadio BBVA", city: "Monterrey", country: "MEX", capacity: 53500, altitude: 540 },
  { id: "bmo", name: "BMO Field", city: "Toronto", country: "CAN", capacity: 45000, altitude: 75 },
];

export function getVenueById(id: string): Venue | undefined {
  return VENUES.find((v) => v.id === id);
}

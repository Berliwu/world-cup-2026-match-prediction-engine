import { WC2026_HOSTS } from "../constants.js";

export function hostAdvantageBonus(teamCode: string, venueCountry: string): number {
  if (!WC2026_HOSTS.includes(teamCode as typeof WC2026_HOSTS[number])) return 0;
  if (teamCode === "USA" && venueCountry === "USA") return 90;
  if (teamCode === "MEX" && venueCountry === "MEX") return 100;
  if (teamCode === "CAN" && venueCountry === "CAN") return 85;
  return 40;
}

export function crowdFactor(attendance: number, capacity: number): number {
  const fill = attendance / capacity;
  return 1 + Math.min(0.15, fill * 0.1);
}

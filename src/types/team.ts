export interface Team {
  id: string;
  name: string;
  code: string;
  fifaRank: number;
  confederation: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
  eloRating: number;
  isHost?: boolean;
}

export interface SquadPlayer {
  name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  club: string;
  marketValue: number;
}

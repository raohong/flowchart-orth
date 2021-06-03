import { Direction } from "../constants";

export interface PathFindingPointData {
  direction: Direction;
  origin: number[];
  endpoint: number[];
}

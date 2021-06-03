import { makeAutoObservable } from 'mobx';
import { uuid } from 'short-uuid';
import { NodeModel } from './Node';
import { Direction } from '../constants';
import { addV } from '../layout/util';

const parsePercent = (p: string) => Number(p.replace('%', '')) / 100;

export class PortModel {
  public id: string = uuid();

  public direction: Direction;
  public x: string;
  public y: string;

  public r: number;
  public node: NodeModel;

  constructor(
    node: NodeModel,
    params: {
      x: string;
      y: string;
      r?: number;
      direction: Direction;
    },
  ) {
    const { x, y, r = 6, direction } = params;
    this.node = node;
    this.x = x;
    this.y = y;
    this.r = r;
    this.direction = direction;

    makeAutoObservable(this);
  }

  get localPosition() {
    const { width, height } = this.node;

    return [width * parsePercent(this.x), height * parsePercent(this.y)];
  }

  get globalPosition() {
    const { x, y } = this.node;
    return addV([x, y], this.localPosition);
  }
}

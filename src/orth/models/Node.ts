import { makeAutoObservable } from 'mobx';
import { uuid } from 'short-uuid';
import { PortModel } from './Port';
import { Direction, ElementState } from '../constants';
import { addV } from '../layout/util';
import type { Vector } from '../type';

export class NodeModel {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public dragging: boolean = false;
  public offset: number[] | null = null;
  public elementState: ElementState;

  public ports: PortModel[];

  public readonly id: string = uuid();

  constructor(params: { x: number; y: number; width: number; height: number }) {
    Object.assign(this, params);
    this.ports = [];
    this.elementState = ElementState.NONE;

    const initialPorts = [
      ['50%', '0%', Direction.TOP],
      ['100%', '50%', Direction.RIGHT],
      ['50%', '100%', Direction.BOTTOM],
      ['0%', '50%', Direction.LEFT],
    ] as Array<[string, string, Direction]>;

    initialPorts.forEach((item) => {
      this.addPort({
        x: item[0],
        y: item[1],
        direction: item[2],
      });
    });

    makeAutoObservable(this);
  }

  addPort(params: { x: string; y: string; direction: Direction }) {
    const port = new PortModel(this, {
      ...params,
    });

    this.ports.push(port);
  }

  onDragStart() {
    this.dragging = true;
    this.offset = [this.x, this.y];
  }

  onDrag(delta: number[]) {
    if (this.offset) {
      [this.x, this.y] = addV(this.offset, delta).map(Math.round);
    }
  }

  onDragEnd() {
    this.dragging = false;
    this.offset = null;
  }

  setSize(size: Vector, xy: Vector) {
    [this.x, this.y] = xy;
    [this.width, this.height] = size;
  }

  setElementState(state: ElementState) {
    this.elementState = state;
  }

  get box() {
    return [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x + this.width, this.y + this.height],
      [this.x, this.y + this.height],
    ];
  }

  get portMap() {
    return new Map(this.ports.map((item) => [item.id, item]));
  }
}

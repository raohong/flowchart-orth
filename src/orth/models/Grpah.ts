import { makeAutoObservable } from 'mobx';
import { NodeModel } from './Node';
import { PortModel } from './Port';
import { EdgeModel } from './Edge';
import { calculateEuclideanDist } from '../layout/util';

export class GraphModel {
  public nodes: NodeModel[] = [];
  public dragingNodes: string[] = [];
  public edges: EdgeModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNode(params: { x: number; y: number; width: number; height: number }) {
    this.nodes.push(new NodeModel(params));
  }

  removeEdge(id: string) {
    this.edges = this.edges.filter((item) => item.id !== id);
  }

  addEdge(params: {
    sourceNodeId: string;
    targetNodeId: string;
    targetPortId: string;
    sourcePortId: string;
  }) {
    const edge = new EdgeModel(this, params);
    this.edges.push(edge);
  }

  onDragNodeStart(id: string) {
    this.dragingNodes = [id];

    this.dragingNodes.forEach((item) => {
      this.nodeMap.get(item)?.onDragStart();
    });
  }

  onDragNode(delta: number[]) {
    this.dragingNodes.forEach((item) => {
      this.nodeMap.get(item)?.onDrag(delta);
    });
  }

  onDragNodeEnd() {
    this.dragingNodes.forEach((item) => {
      this.nodeMap.get(item)?.onDragEnd();
    });
    this.dragingNodes = [];
  }

  getClosestPort(pos: number[]) {
    const all = this.nodes.map((item) => item.ports).flat();

    let min = Infinity;
    let port: PortModel;

    all.forEach((item) => {
      const d = calculateEuclideanDist(pos, item.globalPosition);
      if (d < min && d <= 12) {
        min = d;
        port = item;
      }
    });

    // @ts-ignore
    return port ? { port, node: port.node } : null;
  }

  get nodeMap() {
    return new Map(this.nodes.map((item) => [item.id, item]));
  }

  get edgeMap() {
    return new Map(this.edges.map((item) => [item.id, item]));
  }
}

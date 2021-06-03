import { makeAutoObservable } from 'mobx';
import { uuid } from 'short-uuid';
import type { GraphModel } from './Grpah';

export class EdgeModel {
  public sourceNodeId: string;
  public targetNodeId: string;
  public targetPortId: string;
  public sourcePortId: string;

  public graph: GraphModel;

  public readonly id: string = uuid();

  constructor(
    graph: GraphModel,
    params: {
      sourceNodeId: string;
      targetNodeId: string;
      targetPortId: string;
      sourcePortId: string;
    },
  ) {
    const { sourceNodeId, sourcePortId, targetNodeId, targetPortId } = params;
    this.sourceNodeId = sourceNodeId;
    this.sourcePortId = sourcePortId;
    this.targetNodeId = targetNodeId;
    this.targetPortId = targetPortId;
    this.graph = graph;

    makeAutoObservable(this);
  }
}

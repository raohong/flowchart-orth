import { observer } from 'mobx-react-lite';
import React from 'react';
import { EdgeModel, GraphModel } from '../models';
import Connector from './Connector';

const Edge: React.FC<{ model: EdgeModel; graph: GraphModel }> = ({
  model,
  graph,
}) => {
  const { id, targetNodeId, targetPortId, sourceNodeId, sourcePortId } = model;

  const sourceNode = graph.nodeMap.get(sourceNodeId)!;
  const sourcePort = sourceNode.portMap.get(sourcePortId)!;

  const targetNode = graph.nodeMap.get(targetNodeId)!;
  const targetPort = targetNode.portMap.get(targetPortId)!;

  const startBoxInfo = {
    box: sourceNode.box,
    origin: sourcePort.globalPosition,
    direction: sourcePort.direction,
  };

  const endBoxInfo = {
    box: targetNode.box,
    origin: targetPort.globalPosition,
    direction: targetPort.direction,
  };

  return (
    <g
      className="edge"
      onDoubleClick={() => {
        graph.removeEdge(id);
      }}
    >
      <Connector startBoxInfo={startBoxInfo} endBoxInfo={endBoxInfo} />
    </g>
  );
};

export default observer(Edge);

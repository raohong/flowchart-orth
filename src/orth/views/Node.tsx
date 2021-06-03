import { observer } from 'mobx-react-lite';
import React from 'react';
import classnames from 'classnames';
import { useDrag } from '@use-gesture/react';
import { GraphModel, NodeModel } from '../models';
import Port from './Port';
import { ElementState } from '../constants';

const Node: React.FC<{
  node: NodeModel;
  graph: GraphModel;
}> = ({ node, graph }) => {
  const { x, y, width, height, ports, id, elementState } = node;

  const bind = useDrag(
    ({ movement, first, last }) => {
      if (first) {
        graph.onDragNodeStart(id);
      } else if (!last) {
        graph.onDragNode(movement);
      } else {
        graph.onDragNodeEnd();
      }
    },
    {
      filterTaps: true,
    },
  );

  const cls = classnames('node', {
    [`node-${ElementState.NONE}`]: elementState === ElementState.NONE,
    [`node-${ElementState.ALLOW_CONNECT}`]:
      elementState === ElementState.ALLOW_CONNECT,
    [`node-${ElementState.DISABLE_CONNECT}`]:
      elementState === ElementState.DISABLE_CONNECT,
  });

  return (
    <g className={cls}>
      <g {...bind()} className="node-content">
        <rect
          pointerEvents="visible"
          fill="none"
          stroke="#000"
          x={x}
          y={y}
          width={width}
          height={height}
        />
      </g>
      {ports.map((item) => (
        <Port graph={graph} model={item} key={item.id} />
      ))}
    </g>
  );
};

export default observer(Node);

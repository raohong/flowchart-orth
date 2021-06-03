import React, { useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useDrag } from '@use-gesture/react';
import { PortModel, GraphModel, NodeModel } from '../models';
import { addV } from '../layout/util';
import { Direction, ElementState } from '../constants';
import Connector from './Connector';

const getDiretion = (movement: number[]) => {
  const o =
    (Math.atan2(Math.abs(movement[1]), Math.abs(movement[0])) / Math.PI) * 180;

  let angle = o;
  const angleBound = 45;

  // 顺时针
  if (movement[0] < 0) {
    angle = movement[1] >= 0 ? 180 - o : 180 + o;
  } else {
    angle = movement[1] >= 0 ? o : 360 - o;
  }

  let dir: Direction;

  if (angle <= angleBound || angle > 360 - angleBound) {
    dir = Direction.LEFT;
  } else if (angle > angleBound && angle <= 180 - angleBound) {
    dir = Direction.TOP;
  } else if (angle > 180 - angleBound && angle <= 180 + angleBound) {
    dir = Direction.RIGHT;
  } else {
    dir = Direction.BOTTOM;
  }

  return dir;
};

const Port: React.FC<{ model: PortModel; graph: GraphModel }> = ({
  model,
  graph,
}) => {
  const { globalPosition, r, id, direction, node } = model;

  const [dragState, setDragState] = useState<{
    dragging: boolean;
    movement: number[];
    delta: number[];
  }>({
    dragging: false,
    movement: [0, 0],
    delta: [0, 0],
  });
  const previousActivePort =
    useRef<{
      port: PortModel;
      node: NodeModel;
    } | null>(null);

  const bind = useDrag(
    ({ movement, dragging, last, delta }) => {
      const actived = previousActivePort.current;

      if (last) {
        if (actived) {
          graph.addEdge({
            targetNodeId: actived.node.id,
            targetPortId: actived.port.id,
            sourceNodeId: model.node.id,
            sourcePortId: id,
          });
        }

        previousActivePort.current = null;
        setDragState({
          dragging: false,
          movement: [0, 0],
          delta: [0, 0],
        });
      } else {
        setDragState({
          movement,
          dragging: !!dragging,
          delta,
        });

        const pos = addV(globalPosition, movement);
        const current = graph.getClosestPort(pos);

        if (current?.port.id === id) {
          return;
        }

        if (actived && actived.port !== current?.port) {
          actived.node.setElementState(ElementState.NONE);
        }

        if (current) {
          previousActivePort.current = current;
          current.node.setElementState(ElementState.ALLOW_CONNECT);
        }

        previousActivePort.current = current;
      }
    },
    {
      filterTaps: true,
      pointer: {
        capture: false,
      },
    },
  );

  const { dragging, movement, delta } = dragState;

  const { startBoxInfo, endBoxInfo } = useMemo(() => {
    const xy = addV(globalPosition, movement);

    const startBoxInfo = {
      box: node.box,
      origin: globalPosition,
      direction,
    };

    const actived = previousActivePort.current;

    const endBoxInfo = {
      box: actived ? actived.node.box : undefined,
      origin: actived ? actived.port.globalPosition : xy,
      direction: actived ? actived.port.direction : getDiretion(movement),
    };

    return {
      startBoxInfo,
      endBoxInfo,
    };
  }, [movement, node, globalPosition, direction]);

  return (
    <g className="port">
      <g
        {...bind()}
        style={{
          touchAction: 'auto',
        }}
      >
        <circle
          className="port-active"
          r={r * 1.5}
          cx={globalPosition[0]}
          cy={globalPosition[1]}
        />
        <circle
          className="port-default"
          r={r}
          cx={globalPosition[0]}
          cy={globalPosition[1]}
        />
      </g>
      {dragging && (
        <Connector startBoxInfo={startBoxInfo} endBoxInfo={endBoxInfo} />
      )}
    </g>
  );
};

export default observer(Port);

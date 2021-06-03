import React from 'react';
import { Direction } from '../constants';
import Marker, { fixPathByMarker } from './Marker';
import { createRoute } from '../layout';
import { smoothPath, splitPath } from '../layout/geometry';

const Connector: React.FC<{
  startBoxInfo: { box?: number[][]; direction: Direction; origin: number[] };
  endBoxInfo: { box?: number[][]; direction: Direction; origin: number[] };
}> = ({ startBoxInfo, endBoxInfo }) => {
  const {
    path: { path },
    points,
    boxs,
  } = createRoute(startBoxInfo, endBoxInfo, 20);
  const endpoint = path[path.length - 1];
  const startpoint = path[0];
  const fixedPath = smoothPath(splitPath(fixPathByMarker(path, 2)), 10);

  const tags = [
    [startpoint, 'red'],
    [endpoint, 'pink'],
  ];

  return (
    <g>
      {fixedPath.map((item) => (
        <path stroke="#111" fill="none" strokeWidth={2} key={item} d={item} />
      ))}

      <Marker direction={endBoxInfo.direction} endpoint={endpoint} />

      {tags.map(([item, fill], index) => (
        <circle
          key={index}
          cx={item[0]}
          cy={item[1]}
          r={6}
          fill={fill as string}
        />
      ))}
      {boxs.map((item) =>
        !item.box ? null : (
          <rect
            pointerEvents="none"
            fill={item.fill}
            key={item.fill}
            fillOpacity={0.3}
            x={item.box[0][0]}
            y={item.box[0][1]}
            width={item.box[1][0] - item.box[0][0]}
            height={item.box[2][1] - item.box[1][1]}
          />
        ),
      )}
    </g>
  );
};

export default Connector;

import React from 'react';
import { Direction } from '../constants';
import { subV } from '../layout/util';

const defaultConfig = {
  width: 10,
  height: 15,
};

export const fixPathByMarker = (
  path: number[][],
  strokeWidth: number,
  markerWidth: number = defaultConfig.width,
  markerHeight: number = defaultConfig.height,
) => {
  const o = markerWidth / markerHeight;
  const fixedLength = Math.ceil(o / (strokeWidth / 2));

  return path.map((item, index) => {
    if (index === path.length - 1) {
      const d = subV(item, path[index - 1]).map(Math.sign);

      return subV(item, [d[0] * fixedLength, d[1] * fixedLength]);
    }

    return item;
  });
};

const rotationMap: Record<Direction, number> = {
  [Direction.LEFT]: 0,
  [Direction.TOP]: 90,
  [Direction.RIGHT]: 180,
  [Direction.BOTTOM]: 270,
};

const Marker: React.FC<{
  endpoint: number[];
  direction: Direction;
  width?: number;
  height?: number;
}> = ({
  endpoint,
  direction,
  width = defaultConfig.width,
  height = defaultConfig.height,
}) => {
  const gap = height / 4;

  return (
    <g
      transform={`translate(${endpoint[0]},  ${endpoint[1]}) rotate(${rotationMap[direction]})`}
    >
      <path
        fill="#222"
        d={`M 0 0 L ${-height} ${-width / 2} L ${
          -height + gap
        } 0 L ${-height} ${width / 2} z`}
      />
    </g>
  );
};

export default Marker;

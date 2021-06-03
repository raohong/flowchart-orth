import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { uuid } from 'short-uuid';

const styles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  position: 'absolute',
};

const Grid: React.FC = () => {
  const size = 20;
  const outterSize = 100;
  const opacity = 0.25;
  const stroke = '#ccc';

  const innerId = useRef(uuid());
  const outterId = useRef(uuid());

  return (
    <svg style={styles}>
      <defs>
        <pattern
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          patternUnits="userSpaceOnUse"
          id={innerId.current}
        >
          <polyline
            fill="none"
            strokeOpacity={opacity}
            stroke={stroke}
            points={`${size},${0} ${size},${size} ${0},${size}`}
          />
        </pattern>
        <pattern
          width={outterSize}
          height={outterSize}
          viewBox={`0 0 ${outterSize} ${outterSize}`}
          patternUnits="userSpaceOnUse"
          id={outterId.current}
        >
          <rect
            x="0"
            y="0"
            width={outterSize}
            fill={`url(#${innerId.current})`}
            height={outterSize}
          />
          <rect
            x="0"
            y="0"
            strokeOpacity={opacity * 0.6}
            width={outterSize}
            fill="none"
            stroke={stroke}
            height={outterSize}
          />
        </pattern>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${outterId.current})`}
      />
      <rect x="0" y="0" width="100%" fill="none" height="100%" />
    </svg>
  );
};

export default observer(Grid);

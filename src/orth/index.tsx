import { observer } from 'mobx-react-lite';
import { GraphModel } from './models/Grpah';
import Grid from './views/Grid';
import Node from './views/Node';
import Edge from './views/Edge';
import './styles.less';

const graph = new GraphModel();

graph.addNode({ x: 50, y: 80, width: 100, height: 100 });

graph.addNode({ x: 200, y: 220, width: 80, height: 80 });

graph.addNode({ x: 350, y: 380, width: 100, height: 100 });

const FlowChartOrth = observer(function App() {
  const { nodes, edges } = graph;

  return (
    <div className="container">
      <Grid />
      <svg className="container">
        {nodes.map((node) => (
          <Node graph={graph} key={node.id} node={node} />
        ))}
        {edges.map((node) => (
          <Edge graph={graph} key={node.id} model={node} />
        ))}
      </svg>
    </div>
  );
});

export default FlowChartOrth;

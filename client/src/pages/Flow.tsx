import { useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const SLIDE_WIDTH = 100;
const SLIDE_HEIGHT = 100;
const SLIDE_PADDING = 10;

type SlideDirection = 'left' | 'right' | 'up' | 'down';

type SlideData = Partial<Record<SlideDirection, string>>;

type Slides = Record<string, SlideData>;

// Custom node component
function Slide({ id }: { id: string }) {
  const style = { width: `${SLIDE_WIDTH}px`, height: `${SLIDE_HEIGHT}px` };

  return (
    <div className="border border-red-400 rounded-md bg-white flex items-center justify-center" style={style}>
      {id}
    </div>
  );
}

interface FlowProps {
  slides: Slides;
}

function Flow({ slides }: FlowProps) {
  const nodeTypes: NodeTypes = useMemo(() => ({ slide: Slide }), []);

  const { nodes, edges } = useMemo(() => {
    const stack: { id: string; position: { x: number; y: number } }[] = [
      { id: '1', position: { x: 0, y: 0 } },
    ];
    const visited = new Set<string>();
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    while (stack.length) {
      const { id, position } = stack.pop()!;
      const data = slides[id];
      const node: Node = { id, type: 'slide', position, data };

      nodes.push(node);
      visited.add(id);

      if (!data) continue;

      const directions: SlideDirection[] = ['left', 'right', 'up', 'down'];

      for (const dir of directions) {
        const nextId = data[dir];
        if (nextId && !visited.has(nextId)) {
          let nextPosition = { ...position };
          if (dir === 'left') nextPosition.x -= SLIDE_WIDTH + SLIDE_PADDING;
          if (dir === 'right') nextPosition.x += SLIDE_WIDTH + SLIDE_PADDING;
          if (dir === 'up') nextPosition.y -= SLIDE_HEIGHT + SLIDE_PADDING;
          if (dir === 'down') nextPosition.y += SLIDE_HEIGHT + SLIDE_PADDING;

          stack.push({ id: nextId, position: nextPosition });
          edges.push({
            id: `${id}->${nextId}`,
            source: id,
            target: nextId,
          });
        }
      }
    }

    return { nodes, edges };
  }, [slides]);

  return (
    <ReactFlowProvider>
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} fitView>
            <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
    </ReactFlowProvider>
  );
}

const slides: Slides = {
  '1': { right: '2' },
  '2': { left: '1', up: '3', right: '4' },
  '3': { down: '2' },
  '4': { left: '2' },
};

export default function FlowApp() {
  return <Flow slides={slides} />;
}

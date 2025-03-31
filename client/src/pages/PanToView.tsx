import {
    ReactFlowProvider,
    type Node,
    type NodeProps,
    Background,
    BackgroundVariant,
    ReactFlow,
    useReactFlow,
    type NodeMouseHandler,
  } from '@xyflow/react';
  import { Remark } from 'react-remark';
  import '@xyflow/react/dist/style.css';
  import { useCallback, useMemo } from 'react';
  
  // --- Constants ---
  export const SLIDE_WIDTH = 1920;
  export const SLIDE_HEIGHT = 1080;
  export const SLIDE_PADDING = 10;
  
  // --- Types ---
  type SlideDirection = 'left' | 'right' | 'up' | 'down';
  
  type SlideData = {
    source: string;
    left?: string;
    right?: string;
    up?: string;
    down?: string;
  };
  
  export type SlideNode = Node<SlideData, 'slide'>;
  type Slides = Record<string, SlideData>;
  
  // --- Slide Component ---
  const style = {
    width: `${SLIDE_WIDTH}px`,
    height: `${SLIDE_HEIGHT}px`,
  } satisfies React.CSSProperties;
  
  function Slide({ data }: NodeProps<SlideNode>) {
    return (
      <article className="bg-blue-100 rounded-lg nodrag prose lg:prose-xl flex items-center justify-center" style={style}>
        <Remark>{data.source}</Remark>
      </article>
    );
  }
  
  // --- Input Slides ---
  const slides: Slides = {
    '0': { source: '# Hello, React Flow!', right: '1' },
    '1': { source: 'It’s markdown, so we can add **bold** words or *italics* too!', left: '0', right: '2' },
    '2': { source: '- These are\n- some bullet\n- points', left: '1' },
  };
  
  // --- Slide to Elements ---
  function slidesToElements(initial: string, slides: Slides) {
    const stack: { id: string; position: { x: number; y: number } }[] = [
      { id: initial, position: { x: 0, y: 0 } },
    ];
    const visited = new Set<string>();
    const nodes: SlideNode[] = [];
    const edges = [];
  
    while (stack.length) {
      const { id, position } = stack.pop()!;
      const data = slides[id];
      const node: SlideNode = { id, type: 'slide', position, data };
  
      nodes.push(node);
      visited.add(id);
  
      if (!data) continue;
  
      const directions: SlideDirection[] = ['left', 'right', 'up', 'down'];
  
      for (const dir of directions) {
        const nextId = data[dir];
        if (nextId && !visited.has(nextId)) {
          const nextPosition = { ...position };
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
  }
  
  // --- Inner Component (must be inside context) ---
  function FlowWithPan({ initialSlide }: { initialSlide: string }) {
    const { fitView } = useReactFlow();
    const { nodes, edges } = useMemo(() => slidesToElements(initialSlide, slides), [initialSlide]);
  
    const handleNodeClick = useCallback<NodeMouseHandler>(
      (_, node) => {
        fitView({ nodes: [node], duration: 150 });
      },
      [fitView]
    );
  
    const nodeTypes = useMemo(() => ({ slide: Slide }), []);
  
    return (
      <ReactFlow
        defaultNodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ nodes: [{ id: initialSlide }] }}
        minZoom={0.1}
        onNodeClick={handleNodeClick}
      >
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    );
  }
  
  // --- Final Exported Page ---
  export default function PanToView() {
    return (
      <ReactFlowProvider>
        <FlowWithPan initialSlide="0" />
      </ReactFlowProvider>
    );
  }
  
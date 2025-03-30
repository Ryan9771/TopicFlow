import { ReactFlowProvider, type Node, type NodeProps, Background, BackgroundVariant, ReactFlow } from "@xyflow/react"
import { Remark } from "react-remark";
import '@xyflow/react/dist/style.css';

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_PADDING = 10;
 
type SlideData = {
    source: string;
    left?: string;
    up?: string;
    down?: string;
    right?: string;
  };

export type SlideNode = Node<SlideData, 'slide'>;

type SlideDirection = 'left' | 'right' | 'up' | 'down';

type Slides = Record<string, SlideData>;

const nodeTypes = {
    slide: Slide,
  };
 
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


  
const slides: Record<string, SlideData> = {
    '0': { source: '# Hello, React Flow!', right: '1' },
    '1': { source: 'Its markdown, so we can add **bold** words or *italics* too!.', left: '0', right: '2' },
    '2': { source: '- These are\n- some bullet\n- points', left: '1' },
};


export const slidesToElements = (
    initial: string,
    slides: Slides,
  ) => {
    // Push the initial slide's id and the position `{ x: 0, y: 0 }` onto a stack.
    const stack: {id: string; position: { x: number; y: number} }[] = [{ id: initial, position: { x: 0, y: 0 } }];
    const visited = new Set<string>();
    const nodes = [];
    const edges = [];
   
    // While that stack is not empty...
    while (stack.length) {
      // Pop the current position and slide id off the stack.
      const { id, position } = stack.pop()!;
      // Look up the slide data by id.
      const data = slides[id];
      const node = { id, type: 'slide', position, data };
   
      // Push a new node onto the nodes array with the current id, position, and slide
      // data.
      nodes.push(node);
      // add the slide's id to a set of visited slides.
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
  };

const initialSlide = '0';
const { nodes, edges } = slidesToElements(initialSlide, slides);

export default function PanToView() {
    return (
        <ReactFlowProvider>
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ nodes: [{ id: initialSlide }] }}
            minZoom={0.1}
        >
            <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
        </ReactFlowProvider>
    )
}
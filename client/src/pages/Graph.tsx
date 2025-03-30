import '@xyflow/react/dist/style.css';
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant } from '@xyflow/react';
import { Slide, SLIDE_WIDTH, } from '../components/slides/Slide';

 
const nodeTypes = {
  slide: Slide,
};


const nodes = [
    {
      id: '0',
      type: 'slide',
      position: { x: 0, y: 0 },
      data: { source: '# Hello, React Flow!' },
    },
    {
      id: '1',
      type: 'slide',
      position: { x: SLIDE_WIDTH, y: 0 },
      data: { source: 'Its markdown, so we can add **bold** words or *italics* too!' },
    },
    {
      id: '2',
      type: 'slide',
      position: { x: SLIDE_WIDTH * 2, y: 0 },
      data: { source: '- These are\n- some bullet\n- points' },
    },
  ];


function Graph() {
    return (
        <ReactFlowProvider>
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView minZoom={0.1}>
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </ReactFlowProvider>
    )
}

export default Graph;
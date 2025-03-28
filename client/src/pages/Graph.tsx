import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import { Slide } from '../components/Slide';
 
const nodeTypes = {
  slide: Slide,
};


const nodes = [
    { id: '0', type: 'slide', position: { x: 0, y: 0 }, data: {} },
  ];


function Graph() {
    return (
        <ReactFlowProvider>
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView>
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </ReactFlowProvider>
    )
}

export default Graph;
import { type Node, type NodeProps } from '@xyflow/react';
import { Remark } from 'react-remark';
 
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
 
export type SlideData = {
    source: string;
};

export type SlideNode = Node<SlideData, 'slide'>;
 
const style = {
  width: `${SLIDE_WIDTH}px`,
  height: `${SLIDE_HEIGHT}px`,
} satisfies React.CSSProperties;
 
export function Slide({ data }: NodeProps<SlideNode>) {
  return (
    <article className="bg-blue-100 rounded-sm nodrag prose lg:prose-xl" style={style}>
        <Remark>{data.source}</Remark>
    </article>
  );
}
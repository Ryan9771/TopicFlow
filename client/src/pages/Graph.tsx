import style from "../util/Styles";
import 'beautiful-react-diagrams/styles.css';
import Diagram, { useSchema, createSchema} from 'beautiful-react-diagrams';

const initialSchema = createSchema({
    nodes: [
        {
            id: "1",
            content: "Node 1",
            coordinates: [250, 60],
        },
        {
            id: "2",
            content: "Node 2",
            coordinates: [100, 200],
        },
        {
            id: "3",
            content: "Node 3",
            coordinates: [250, 200]
        },
        {
            id: "4",
            content: "Node 4",
            coordinates: [400, 200]
        }
    ],
    links: [
        {
            input: '1',
            output: '2'
        },
        {
            input: '1',
            output: '3'
        },
        {
            input: '1',
            output: '4'
        }
    ],
});


function Graph() {
    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div className="w-full flex">
            <Diagram schema={schema} onChange={onChange} />
        </div>
    )
}


const styles = {

}

export default Graph;
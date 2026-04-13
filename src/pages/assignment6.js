import { useState, useEffect } from "react";
import * as d3 from "d3";
import 'bootstrap/dist/css/bootstrap.css'
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import { Graph } from "../components/graph";
import { TreeMap } from "../components/treemap";
import { getTree } from "../utils/getTree";


// The data is from the healthcare dataset.
const csvUrl = "https://gist.githubusercontent.com/hogwild/a716b6186d730c1d86962e9acaa1e59f/raw/aca017d18e2330668ef2765c5c049f89becda4ac/healthcare_stroke_data.csv";
function useData(csvPath){
    const [dataAll, setData] = useState(null);
    useEffect(() => {
        d3.csv(csvPath).then(data => {
            setData(data);
        });
    }, []);
    return dataAll;
}

const App = () => {
    const [selectedDisease, setSelectedDisease] = useState("stroke");
    const [firstAttr, setFirstAttr] = useState("stroke");
    const [secondAttr, setSecondAttr] = useState("null");
    const [thirdAttr, setThirdAttr] = useState("null");
    const [selectedCell, setSelectedCell] = useState(null);//for highlighting the selected cell in the treemap
    
    const WIDTH = 600;
    const HEIGHT = 400;
    const margin = { top: 20, right: 40, bottom: 20, left: 40 };
    const rawData = useData(csvUrl);
    if (!rawData) {
        return <p>Loading...</p>
    }
    const attributes = [ firstAttr, secondAttr, thirdAttr ].filter( d => d !== "null");
    const onFristAttrChange = ( attr ) => {
        setFirstAttr(attr);
    }
    const onSecondAttrChange = ( attr ) => {
        setSecondAttr(attr);
    }
    const onThirdAttrChange = ( attr ) => {
        setThirdAttr(attr);
    }
    const onDiseaseChange = ( disease ) => {
        setSelectedDisease(disease);
    }
    const data = rawData.filter(d => d[selectedDisease] === "1");
    // console.log("data:", data);
    const tree_ = getTree(data, attributes);
    console.log("tree:", tree_);
    const tree = {"name":"root", "children": tree_};
    const options = [{value: "null", label: "None"},{value: "gender", label: "Gender"}, {value: "stroke", label: "Stroke"},
        {value: "heart_disease", label: "Heart Disease"}, {value: "hypertension", label: "Hypertension"}, {value: "ever_married", label: "Ever Married"}];
    
    const diseaseOptions = [{value: "stroke", label: "Stroke"}, {value: "heart_disease", label: "Heart Disease"}];

    return <Container>
        <Row className={"justify-content-md-left"}>
            <Col lg={10} >
                <h1>Healthcare Data</h1> 
                <h2>Context</h2>
                <p>In this assignment, we will use the <a href="https://gist.github.com/hogwild/a716b6186d730c1d86962e9acaa1e59f">healthcare dataset</a>. 
                    The data contains information about patients with stroke and heart disease. 
                    We will visualize the relationships between different attributes in the data.</p>
                <p>The following attributes in the dataset are used in this assignment:</p>
                <ul>
                    <li>id: unique identifier</li>
                    <li>gender: &quot;Male&quot;, &quot;Female&quot; or &quot;Other&quot;</li>
                    <li>hypertension: 0 or 1</li>
                    <li>heart_disease: 0 or 1</li>
                    <li>ever_married: &quot;Yes&quot; or &quot;No&quot;</li>
                    <li>stroke: 0 or 1</li>
                </ul>
            </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
            <Col lg={10} >
                <h2>Node-linked diagram</h2>
                <p>The node-linked diagram shows the relationships between different attributes in the data. The distance between two nodes shows the level of relation between them.</p>
            </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
            <Col lg={4}>
                <h4>A dataset overview</h4>
                <p>Each node represents an attribute in the dataset. For example, the ever_married is close to stroke 
                but far from heartDisease, which means people who ever married are more likely to have stroke. 
                Also, we can see the people who never married are less likely to have stroke but more likely to have heart disease.</p>
                <p>The size of the node represents the number of patients with that attribute.
                The width of the link represents the number of patients with both attributes. For example, the link between &quot;hypertension&quot; and &quot;heart_disease&quot; represents the number of patients with both attributes.</p>
            </Col>
            <Col lg={6} >
                <Graph margin={margin} svg_width={WIDTH} svg_height={HEIGHT} data={rawData}/>
            </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
            <Col lg={10} >
                <h2>Treemap</h2>
                <p>The treemap visualizes hierarchical data using nested rectangles. It allows you to show proportions. For example, you can show the stroke occurrences across marriage or gender groups.</p>
            </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
            <Col lg={3}>
                <h4>Diseases</h4>
                <p>Select the disease to visualize:</p>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-disease">
                        {diseaseOptions.find(option => option.value === selectedDisease)?.label || "Select a Disease"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {diseaseOptions.map(option => (
                            <Dropdown.Item key={option.value} onClick={() => onDiseaseChange(option.value)}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <h4>Attributes</h4>
                <p>Select the attributes to visualize:</p>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-attr1">
                        {options.find(option => option.value === firstAttr)?.label || "Select First Attribute"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {options.map(option => (
                            <Dropdown.Item key={option.value} onClick={() => onFristAttrChange(option.value)}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-attr2">
                        {options.find(option => option.value === secondAttr)?.label || "Select Second Attribute"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {options.map(option => (
                            <Dropdown.Item key={option.value} onClick={() => onSecondAttrChange(option.value)}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-attr3">
                        {options.find(option => option.value === thirdAttr)?.label || "Select Third Attribute"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {options.map(option => (
                            <Dropdown.Item key={option.value} onClick={() => onThirdAttrChange(option.value)}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col lg={7} >
              <h4>{`Why people get ${selectedDisease}? - A treemap explanation`}</h4>
               <TreeMap margin={margin} svg_width={WIDTH} svg_height={HEIGHT} tree={tree} selectedCell={selectedCell} setSelectedCell={setSelectedCell}/>
            </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
            <Col lg={10} >
                <h2>References</h2>
                <p>The data is from the healthcare dataset. The dataset is available at: 
                    <a href="https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset"> Stroke Prediction Dataset</a></p>
            </Col>
        </Row>
    </Container>
}

export default App;
import { groups } from "d3";


export function getNodes({rawData}) {
    const nodes = [];
    const heartDisease = groups(rawData, d => d.heart_disease);
    // console.log("heartDisease", heartDisease);
    // nodes.push({name: "no_heartDisease", value: heartDisease[0][1].length/rawData.length});
    nodes.push({name: "heartDisease", value: heartDisease[0][1].length});
    const married = groups(rawData, d => d.ever_married);
    // console.log("married", married);
    nodes.push({name: "ever_married", value: married[0][1].length}) ;
    nodes.push({name:"never_married", value: married[1][1].length});
    const hypertension = groups(rawData, d => d.hypertension);
    // console.log("hypertension", hypertension);
    // nodes.push({name: "no_hypertension", value: hypertension[0][1].length/rawData.length});
    nodes.push({name: "hypertension", value: hypertension[1][1].length});
    const gender = groups(rawData, d => d.gender);
    // console.log("gender", gender);
    nodes.push({name:"male", value: gender[0][1].length});
    nodes.push({name:"female", value: gender[1][1].length});
    const stroke = groups(rawData, d => d.stroke);
    // console.log("stroke", stroke);
    nodes.push({name:"stroke", value: stroke[0][1].length});
    // nodes.push({name:"no_stroke", value: stroke[1][1].length/rawData.length});
    // nodes.push({name:"otherGender", value: gender[2][1].length})    
    return nodes;
}
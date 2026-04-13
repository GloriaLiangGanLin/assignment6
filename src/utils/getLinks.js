import {groups} from "d3";

export function getLinks({rawData}) {
    const links = [];
    const genderHeartDisease = groups(rawData, d=>d.gender, d => d.heart_disease, );
    // console.log("genderHeartDisease", genderHeartDisease);
    links.push({source: "male" , target: "heartDisease", value: genderHeartDisease[0][1][0][1].length});
    links.push({source: "female" , target: "heartDisease", value: genderHeartDisease[0][1][1][1].length});
    const heartDiseaseStroke =groups(rawData, d => d.heart_disease, d=>d.stroke);
    // console.log("heartDiseaseStroke", heartDiseaseStroke);
    links.push({source: "heartDisease" , target: "stroke", value: heartDiseaseStroke[0][1][0][1].length});
    // links.push({source: "heartDisease" , target: "female", value: heartDiseaseGender[0][1][1][1].length/(heartDiseaseGender[0][1][0][1].length+heartDiseaseGender[0][1][1][1].length)});
    const heartDiseaseHypertension = groups(rawData, d => d.heart_disease, d=>d.hypertension);
    // console.log("heartDiseaseHypertension", heartDiseaseHypertension);
    links.push({source: "heartDisease" , target: "hypertension", value: heartDiseaseHypertension[0][1][1][1].length});

    const heartDiseaseMarried = groups(rawData, d => d.heart_disease, d=>d.ever_married);
    // console.log("heartDiseaseMarried", heartDiseaseMarried);
    links.push({source: "heartDisease" , target: "ever_married", value: heartDiseaseMarried[0][1][0][1].length});
    links.push({source: "heartDisease" , target: "never_married", value: heartDiseaseMarried[0][1][1][1].length});
    
    const strokeGender = groups(rawData, d => d.stroke_disease, d=>d.gender);
    // console.log("heartDiseaseGender", heartDiseaseGender[0][1][1]);
    links.push({source: "stroke" , target: "male", value: strokeGender[0][1][0][1].length});
    links.push({source: "stroke" , target: "female", value: strokeGender[0][1][1][1].length});
    // links.push({source: "heartDisease" , target: "female", value: heartDiseaseGender[0][1][1][1].length/(heartDiseaseGender[0][1][0][1].length+heartDiseaseGender[0][1][1][1].length)});
    const strokeHypertension = groups(rawData, d => d.stroke, d=>d.hypertension);
    // console.log("stroke", strokeHypertension);
    links.push({source: "stroke" , target: "hypertension", value: strokeHypertension[0][1][1][1].length});

    const strokeMarried = groups(rawData, d => d.heart_disease, d=>d.ever_married);
    // console.log("strokeMarried", strokeMarried);
    links.push({source: "stroke" , target: "ever_married", value: strokeMarried[0][1][0][1].length});
    links.push({source: "stroke" , target: "never_married", value: strokeMarried[0][1][1][1].length});
    
    const hypertensionGender = groups(rawData, d => d.hypertension, d=>d.gender);
    // console.log("heartDiseaseGender", heartDiseaseGender[0][1][1]);
    links.push({source: "hypertension" , target: "male", value: hypertensionGender[0][1][0][1].length});
    links.push({source: "hypertension" , target: "female", value: hypertensionGender[0][1][1][1].length});
    // links.push({source: "heartDisease" , target: "female", value: heartDiseaseGender[0][1][1][1].length/(heartDiseaseGender[0][1][0][1].length+heartDiseaseGender[0][1][1][1].length)});

    const hypertensionMarried = groups(rawData, d => d.hypertension, d=>d.ever_married);
    // console.log("hypertensionMarried", hypertensionMarried);
    links.push({source: "hypertension" , target: "ever_married", value: hypertensionMarried[0][1][0][1].length});
    links.push({source: "hypertension" , target: "never_married", value: hypertensionMarried[0][1][1][1].length});
    return links;
}
import {csv,json} from 'd3';

import {
  parseInstanceData,
  parseMedicareData,
  parseDatasets,
  parseProviderData

} from './utils';

const chiaDataPromise = csv('./data/CHIATransparency.csv', parseProviderData)

const headDataPromise = csv('./data/john_viz_head.csv')
	// .then(data => data.reduce((acc,v) => acc.concat(v), []));

const abdomenDataPromise = csv('./data/john_viz_abdomen.csv',parseDatasets)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));

const kneeDataPromise = csv('./data/john_viz_knee.csv')
	// .then(data => data.reduce((acc,v) => acc.concat(v), []));

// const nationalDataPromise = csv('./data/National_Downloadable_File.csv', parseProviderData)
// .then(data => data.reduce((acc,v) => acc.concat(v), []));

const smallDataPromise = csv('./data/small_data_webpack.csv', parseProviderData)
.then(data => data.reduce((acc,v) => acc.concat(v), []));

//medicare data
  $.ajax({
      url: "https://data.cms.gov/resource/haqy-eqp7.json",
      type: "GET",
      data: {
        "$limit" : 5000,
        "$$app_token" : "5mlUJVVF85sBYWLFTBeTHkNo3"
      }

  }).done(function(data) {
  	const healthdata = data;
  	// console.log(healthdata);
  });
// const medicareDataPromise = json("https://data.cms.gov/resource/haqy-eqp7.json"?$$app_token="5mlUJVVF85sBYWLFTBeTHkNo3"&limit=3000$offset=6000);
const medicareDataPromise = json("https://data.cms.gov/resource/haqy-eqp7.json",parseMedicareData)

const schemaData = {
  abdomen: [
        {name: 'abdomen', type: 'dropdown', code: "fever", display: 'Fever', values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "vomiting", display: 'Vomiting', values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "swelling", display: 'Swelling', values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "diarrhea", display: 'diarrhea', values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "blood_in_stool", display: 'Blood in your stools', values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "risk_factors", display: "Do you have any of the following risk factors: hypertension, heart attack, smoking?", values: [true,false]},
        {name: 'abdomen', type: 'dropdown', code: "age", display: 'Age',
            values: ['18 – 45','46 – 64','65 and over']},
        {name: 'abdomen', type: 'dropdown', code: "gender", display: 'Gender',
            values: ['male','female']},
        {name: 'abdomen', type: 'dropdown', code: "time", display: 'Time since pain began?',
            values: ['1-3 days','4-7 days','a week or more']},
        {name: 'abdomen', type: 'dropdown', code: "pain", display: 'How would you rate your pain level on a scale of 1 – 10?',
            values: ["1-3","4-7","8-10"]},
        {name: 'abdomen', type: 'dropdown', code: "location", display: 'What region is pain in?',
            values: ["Right Lower Quadrant","Right Upper Quadrant","Left Lower Quadrant","Left Upper Quadrant"]}
      ],
  knee: [
        {name: 'knee', type: 'dropdown', code: "fever", display: 'Fever', values: [true,false]},
        {name: 'knee', type: 'dropdown', code: "vomiting", display: 'Vomiting', values: [true,false]},
        {name: 'knee', type: 'dropdown', code: "swelling", display: 'Swelling', values: [true,false]},
        {name: 'knee', type: 'dropdown', code: "risk_factors", display: "Do you have any of the following risk factors: hypertension, heart attack, smoking?", values: [true,false]},
        {name: 'knee', type: 'dropdown', code: "age", display: 'Age',
            values: ['18 – 45','46 – 64','65 and over']},
        {name: 'knee', type: 'dropdown', code: "gender", display: 'Gender',
            values: ['male','female']},
        {name: 'knee', type: 'dropdown', code: "time", display: 'Time since pain began?',
            values: ['1-3 days','4–8 days','9 or 10 days']},
        {name: 'knee', type: 'dropdown', code: "pain", display: 'How would you rate your pain level on a scale of 1 – 10?',
            values: ["1 – 3","4 – 7","8 – 10"]},
        {name: 'knee', type: 'dropdown', code: "location", display: 'What region is pain in?',
            values: ["Anterior","Posterior","Medial","Lateral"]}
      ],
  head: [
        {name: 'head', type: 'dropdown', code: "fever", display: 'Fever', values: [true,false]},
        {name: 'head', type: 'dropdown', code: "vomiting", display: 'Vomiting', values: [true,false]},
        {name: 'head', type: 'dropdown', code: "diarrhea", display: 'diarrhea', values: [true,false]},
        {name: 'head', type: 'dropdown', code: "dissy", display: 'Are you dizzy?', values: [true,false]},
        {name: 'head', type: 'dropdown', code: "risk_factors", display: "Do you have any of the following risk factors: hypertension, heart attack, smoking?", values: [true,false]},
        {name: 'head', type: 'dropdown', code: "age", display: 'Age',
            values: ['18 – 45','46 – 64','65 and over']},
        {name: 'head', type: 'dropdown', code: "gender", display: 'Gender',
            values: ['male','female']},
        {name: 'head', type: 'dropdown', code: "time", display: 'Time since pain began?',
            values: ['1-3 days','4-7 days','a week or more']},
        {name: 'head', type: 'dropdown', code: "pain", display: 'How would you rate your pain level on a scale of 1 – 10?',
            values: ["1-3","4-7","8-10"]},
        {name: 'head', type: 'dropdown', code: "location", display: 'What region is pain in?',
            values: ["Frontal","Deep","Neck"]}
      ]
};

const parameterData =
  {  "abdomen": {
      "parameters":{
        "age":['18 – 45','46 – 64','65 and over'],
        "gender":['male','female'],
        "time":['1-3 days','4-7 days','a week or more'],
        "location":["Right Lower Quadrant","Right Upper Quadrant","Left Lower Quadrant","Left Upper Quadrant"],
        "pain":["1-3","4-7","8-10"],
      	"fever":[true,false],
      	"vomiting":[true,false],
      	"swelling":[true,false],
      	"diarrhea":[true,false],
      	"blood_in_stool":[true,false],
      	"risk_factors":[true,false]
        // "Age Range":['18 – 45','46 – 64','65 and over'],
        // "Gender":['male','female'],
        // "Approximately how long have you experiences these symptoms?":['1-3 days','4-7 days','a week or more'],
        // "In what area of your abdomen does your pain exist?":["Right Lower Quadrant","Right Upper Quadrant","Left Lower Quadrant","Left Upper Quadrant"],
        // "How would you rate your pain level on a scale of 1-10?":["1-3","4-7","8-10"],
        // "fever":[true,false],
        // "vomiting":[true,false],
        // "swelling":[true,false],
        // "diarrhea":[true,false],
        // "Do you have blood in your stools?":[true,false],
        // "Do you have any risk factors such as alcholo abuse, heart issues, smoking?":[true,false]
      },
      "displays":{
        "age": "What is your age range?"
      }
    },//ends abdomen
    "knee": {
      "parameters":{
        "age":['18 – 35','36 – 64','65 and over'],
        "gender":['male','female'],
        "time":['1-3 days','4-7 days','a week or more'],
        "location":["Anterior","Posterior","Medial","Lateral"],
        "pain":["1-3","4-7","8-10"],
      	"fever":[true,false],
      	"vomiting":[true,false],
      	"risk_factors":[true,false],
        "swelling":[true,false]
      },
    },
    "head": {
      "parameters":{
        "age":['18 – 35','36 – 64','65 and over'],
        "gender":['male','female'],
        "location":["Frontal","Deep","Neck"],
        "time":['1-3 days','4-7 days','a week or more'],
        "pain":["1-3","4-7","8-10"],
        "vomiting":[true,false],
        "fever":[true,false],
      	"diarrhea":[true,false],
        "dissy":[true,false],
        "risk_factors":[true,false]
      },
    }
  }


export {
	parameterData,
  headDataPromise,
  abdomenDataPromise,
  kneeDataPromise,
  chiaDataPromise,
  medicareDataPromise,
  smallDataPromise,
  schemaData
}

const chiaDataPromise = d3.csv('../data/CHIATransparency.csv', parseProviderData)

const headDataPromise = d3.csv('../data/john_viz_head.csv')
	// .then(data => data.reduce((acc,v) => acc.concat(v), []));

const abdomenDataPromise = d3.csv('../data/john_viz_abdomen.csv',parseDatasets)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));

const kneeDataPromise = d3.csv('../data/john_viz_knee.csv')

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
const medicareDataPromise = d3.json("https://data.cms.gov/resource/haqy-eqp7.json",parseMedicareData)

const schemaData = getVariableData();//get the data for variable located at bottom of page

let sliderRiskLevel = 5;
const globalDispatch = d3.dispatch(
	'make:bars',
	'display:slider',
	'rec:input',
	'run:all:three'
);

let dataObject;

const slider2 = RangeSlider2()
	.values([1,2,3,4,5,6,7,8,9,10])
	.on('change', (value) => {//trigger change in display upon change in slider value
		globalDispatch.call('run:all:three',null,value,dataObject);//updates visual when slider changes
	});

function SwapDivsWithClick(div1,div2,div3) {//displays the form divs after
	//clicking on a body part

 let d1 = document.getElementById(div1);
 let d2 = document.getElementById(div2);
 let d33 = document.getElementById(div3);

	 if( d2.style.display == "none" ) {
				d3.select(d1)
					.style('display','none');//instruct message dissappears
				d3.select(d33)
					.style('display','block');//form and new instruction appears
				d3.select(d2)
					.transition()
					.delay(300)
					.style('display','block')
				d3.select(d2)
					.append("div")
					.attr('class','btn-primary')
					.attr('class','btn')
					.attr('id','saveFormInputs')
					.text('Submit Answers')
	  }
}

//load the data
Promise.all([
	headDataPromise,
	abdomenDataPromise,
	kneeDataPromise,
	chiaDataPromise,
	])
	.then(([headData,abdomenData,kneeData,chiaData]) => {

  //when Head, Abdomen or Knee is clicked on the body the body_clicked function runs
  d3.select("#abdomen_part")
  	.on('click',() => {
  		body_clicked(schemaData.abdomen,abdomenData,matchObjAbdomen);
  	})

  d3.select("#head_part")
  	.on('click',() => {
  		console.log(schemaData.head);
  		body_clicked(schemaData.head,headData,matchObjHead);
  	})

  d3.select("#knee_part")
  	.on('click',() => {
  		body_clicked(schemaData.knee,kneeData,matchObjKnee);
  	})

  //this is main function that displays the correct form for the body part clicked and
  //includes the Submit button that makes the visualization when submitted
  function body_clicked(b,c,d){

  		SwapDivsWithClick('explainFormHere','formDiv','topOfForm');//displays divs for form
  		formModule(b); //populates the form

  let submitButton = d3.select('#saveFormInputs');
  	submitButton.on('click', () => {//displays the slider and scrolls down to the visual
  		d3.select('#slider')
  			.style('display','block');

  let elmnt = document.getElementById("slider");
  		elmnt.scrollIntoView();

  		dataObject = c.find(d);
  		globalDispatch.call('run:all:three',null,5,dataObject);//activates the visual parts
  })
  }

  //display slider
  globalDispatch.on('display:slider', () => {
  	// Call the module to create the slider
  		d3.select('#slider2').call(slider2);
  })

  //display the bars representing risk level
  globalDispatch.on('make:bars', (d) => {
  	riskBarDisplay(d);
  })

  // this function calculates the average costs for various options (er, urgent,primary)
  const getAveCost = function(data,code){
  	let filteredData = data.filter(d => d.code === code);
  	let description = filteredData[0].description;
  	let costs = d3.nest()
  		.key(d => d.code)
  		.rollup(function(v) {
  				return {
  					average_cost: d3.mean(v, function(d) {return d.cost}).toFixed(2),
  					data_points: v.length,//see which is more or less common
  				};
  			})
  		.entries(filteredData);
  	return {costs,description};
  }

  // Displays recomendations and associated costs
  globalDispatch.on('rec:input',(recommendation,risk) => {
  	let cost_description;
  	console.log(recommendation);
   if (recommendation === 'Emergency Room'){
  	 cost_description = {high:getAveCost(chiaData,99285),low:getAveCost(chiaData,99281)};
  	 writeOut(cost_description);
   } else if (recommendation === 'Primary Care'){
  	 cost_description = {high:getAveCost(chiaData,99215),low:getAveCost(chiaData,99201)};
  	 writeOut(cost_description);
   } else if (recommendation === 'Urgent Care'){
  	 cost_description = {high:getAveCost(chiaData,99215),low:getAveCost(chiaData,99201)};
  	 writeOut(cost_description);
   } else if (recommendation === 'Nothing'){
  	 writeOutNothing();
   }

  function writeOut(thing){
  	d3.select('#table_risk')
  		.html(`${risk}`);
  	d3.select('#table_rec')
  		.html(`${recommendation}`);
  	d3.select('#lists')
  		.style('display','block');
  	d3.select('#table_low_detail')
  		.html(`${cost_description.low.description}`);
  	d3.select('#table_low_cost')
  		.html(`$${cost_description.low.costs[0].value.average_cost}`);
  	d3.select('#table_high_detail')
  		.html(`${cost_description.high.description}`);
  	d3.select('#table_high_cost')
  		.html(`$${cost_description.high.costs[0].value.average_cost}`);
  	d3.select('#nothing')
  		.style('display','none');
  }

  function writeOutNothing(){
  	d3.select('#table_risk')
  		.html(`${risk}`)
  	d3.select('#table_rec')
  		.html(`${recommendation}`)
  	d3.select('#nothing')
  		.style('display','block')
  		.style('text-align','left')
  		.html(`The recommendation is to do nothing for now. But understand that you should continue
  			to monitor your symptoms. If they get worse or persist for more than 48 hours, you should call
  			your doctor or retake this assessment.`)
  	d3.select('#lists')
  		.style('display','none')
  }
  })//ends 'rec:input'

  //selects the correct data object based on user input and then feeds it to other elements
  //so that bars, slider, and written explaination are properly displayed
  globalDispatch.on('run:all:three',(risk,data) => {

  let dataObject = data;
  let newObject;
  let recommendation;
  const riskObjectAfterSlider = (risk) => {
  	if (risk === 5){
  		return newObject = [
  			{value: dataObject.er, name: "Emergency Room"},
  			{value: dataObject.urgent, name: "Urgent Care"},
  			{value: dataObject.primary, name: "Primary Care"},
  			{value: dataObject.nothing, name: "Nothing"}
  		]
  	} else if (risk < 5) {
  		return newObject = [
  			{value: dataObject.er + ((risk/5)/1/1), name: "Emergency Room"},
  			{value: dataObject.urgent + ((risk/5)/1), name: "Urgent Care"},
  			{value: dataObject.primary - ((risk/5)/1), name: "Primary Care"},
  			{value: dataObject.nothing - ((risk/3)/1), name: "Nothing"}
  		]
  	} else if (risk > 5) {
  		return newObject = [
  			{value: dataObject.er - ((risk/5)/1), name: "Emergency Room"},
  			{value: dataObject.urgent - ((risk/5)/1), name: "Urgent Care"},
  			{value: dataObject.primary + ((risk/5)/1), name: "Primary Care"},
  			{value: dataObject.nothing + ((risk/3)/1), name: "Nothing"}
  		]
  	}
  }
  riskObjectAfterSlider(risk);
  //formRec forms a recommendation values in data and an adjustment for the risk level chosen
  const formRec = function(){
  		if (newObject[0].value >= 8){
  			return recommendation = "Emergency Room";
  	} else if (newObject[1].value >= 7){
  			return recommendation = "Urgent Care";
  	} else if (newObject[2].value >= 4){
  			return recommendation = "Primary Care";
  	} else {
  			return recommendation = "Nothing";
  	}
  }
  formRec();

  	globalDispatch.call('display:slider',null,);
  	globalDispatch.call('rec:input',null,recommendation,risk);
  	document.getElementById('flexer').style.display = "flex";
  	globalDispatch.call('make:bars',null,riskObjectAfterSlider(risk));

  });//ends 'run:all:three'

})//ends all promises


  //begin the MODULES
  // bars MODULES
function riskBarDisplay(data){

  let margin = ({top: 30, right: 0, bottom: 40, left: 20})
  let height = 400;
  let width = 400;

  let y = d3.scaleLinear()
    .domain([0, 10]).nice()
    .range([height - margin.bottom, margin.top]);

  let x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));
    // .call(text_bottom);

  let text = g => g
    .attr("transform", `translate(${margin.left},${height - 5})`)
    .append('text')
    .attr('font-size',14)
    .text('Higher the bar, the more urgently we recommend the option.');

  const svg = d3.select('#svg1').attr('width',width).attr('height',height);

  //UPDATE SELECTION
  const nodes = svg.selectAll('.node')
  	.data(data);

  //ENTER SELECTION
  const nodesEnter = nodes.enter()
  	.append('g').attr('class', 'node');
  nodesEnter.append('rect');

  nodes.merge(nodesEnter)
    .select('rect')
    .transition()
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("height", d => y(0) - y(d.value))
    .attr("width", x.bandwidth())
    .attr("fill", '#1ABB9C');

  const xAx = nodes.enter()
    .append("g")
    .call(xAxis);

  const yAx = nodes.enter()
    .append("g")
    .call(yAxis);

  const xText = nodes.enter()
    .append('g')
    .call(text);
}


  //form_display MOdule
const formModule = function(data){


		let t = d3.transition()
    					.duration(750)
							.ease(d3.easeLinear);

		let form = d3.select("#putFormHere");

		form.html('');//clear out the form

		form = d3.select("#putFormHere");
			form.attr('class','form-inline');

		let top = form.append('text')
				.text('Complete the form and press Submit')
				.attr('id','topOfForm');

		let p = form.selectAll("div")

				.data(data)
				.enter()
				.append('div')
				.attr('class','form-group')
				.each(function(d){
						let self = d3.select(this);

						let label = self.append("label")
								.text(d.display)
								.transition(t)
								.attr('class',"wrapper-dropdown-label")
								.attr('class',"var-labels")
								// .attr('class','label')
								// .attr('class','label-default')

						if(d.type == 'text'){
								let input = self.append("input")
										.attr({
												type: function(d){ return d.type; },
												name: function(d){ return d.name; }
										});
						}

						if(d.type == 'dropdown'){
						let select = self.append("select")
										.attr("name", "country")
										.attr("id",d.code)
										.attr('class',"wrapper-dropdown-inside")
										.attr('class',"form-control-lg")
										.attr('class',"var-drops")
										.selectAll("option")
										.data(d.values)
										.enter()
										.append("option")
										.text(function(d) { return d; });
						}

						if(d.type == 'checkbox'){
						let inputbox = self.append("input")
							.attr("type","radio")
							.attr("id",d.code)
						}
				});
}

//Slider MOdule
function RangeSlider2(){

	let sliderValues = [0,0];
	const margin = {l:60, r:60};
	const drag = d3.drag();
	const internalDispatch = d3.dispatch('change');

	function exports(container){
		//Build DOM elements for the range slider
		//First, take/set pixel dimensions for
		const W = container.node().clientWidth;
		const H = 75;
		container.style('height', `${H}px`);
		const w = W - margin.l - margin.r;

		//Create an axis generator function to generate ticks for the slider
		const scaleX = d3.scaleLinear().domain(d3.extent(sliderValues)).range([0,w]);
		const axisX = d3.axisBottom()
			.scale(scaleX)
			.tickValues(sliderValues)
			.tickFormat(d3.format('0'));

		//Set up drag behavior
		drag
			.on('start', onDragStart)
			.on('drag', onDrag)
			.on('end', onDragEnd);

		//Use enter/exit/update pattern to append DOM elements
		let svg = container.selectAll('svg')
			.data([1]);
		const svgEnter = svg.enter()
			.append('svg');
		let sliderInner = svgEnter.append('g')
			.attr('class', 'range-slider-inner');
		sliderInner.append('line').attr('class', 'track-outer');
		sliderInner.append('line').attr('class', 'track-inner');
		sliderInner.append('circle').attr('class', 'drag-handle');
		sliderInner.append('g').attr('class', 'axis');

		//Update DOM elements appearance
		svg = svgEnter.merge(svg)
			.attr('width', W)
			.attr('height', H);
		sliderInner = svg.select('.range-slider-inner')
			.attr('transform', `translate(${margin.l}, ${H/2})`);
		sliderInner.select('.track-outer')
			.attr('x1', w)
			.attr('stroke', '#666')
			.attr('stroke-width', '4px')
			.attr('stroke-linecap', 'round');
		sliderInner.select('.track-inner')
			.attr('x1', w)
			.attr('stroke', 'white')
			.attr('stroke-width', '4px')
			.attr('stroke-linecap', 'round');
		const dragHandle = sliderInner.select('.drag-handle')
			.attr('r', 8)
			.attr('stroke', '#007bff')
			.attr('stroke-width', '2px')
			.attr('fill', 'red')
			.style('cursor', 'pointer')
			.call(drag);
		sliderInner.select('.axis')
			.attr('transform', `translate(0,4)`)
			.call(axisX)
			.select('.domain')
			.style('fill','red')
			.style('display', 'none');

		//Drag behavior
		function onDragStart(){
			dragHandle.transition().attr('r', 12);
		}

		function onDrag(){
			let currentX = d3.event.x;
			if(currentX < 0){
				currentX = 0;
			}else if(currentX > w){
				currentX = w;
			}

			dragHandle.attr('cx', currentX);
		}

		function onDragEnd(){
			dragHandle.transition().attr('r', 8);

			let currentX = d3.event.x;
			if(currentX < 0){
				currentX = 0;
			}else if(currentX > w){
				currentX = w;
			}

			//"Snap" value to one of the ticks
			let currentValue = scaleX.invert(currentX);
			const i = d3.bisectRight(sliderValues, currentValue);
			currentValue = sliderValues[i];
			currentX = scaleX(currentValue);

			dragHandle.attr('cx', currentX);

			internalDispatch.call('change', null, currentValue);
		}
	}

	//Getter/setter methods
	exports.values = function(_){
		sliderValues = _;
		return this;
	}

	exports.on = function(...args){
		internalDispatch.on(...args);
		return this;
	}

	return exports;

}

// Object MODULES
//find the matching object based on input values
function matchObjAbdomen(i) {//only works for abdomen

let formData = document.theForm.elements;

  return i['age'] === formData['age'].value&&
          i['gender'] === formData['gender'].value&&
          i['time'] === formData['time'].value&&
          i['location'] === formData['location'].value&&
          i['pain'] === formData['pain'].value&&
          String(i['fever']) === formData['fever'].value&&
          String(i['vomit']) === formData['vomiting'].value&&
          String(i['swelling']) === formData['swelling'].value&&
          String(i['diarrhea']) === formData['diarrhea'].value&&
          String(i['blood_stool']) === formData['blood_in_stool'].value&&
          String(i['risks']) === formData['risk_factors'].value
}

function matchObjHead(i) {

let formData = document.theForm.elements;

return  i.age === formData['age'].value&&
        i.gender === formData['gender'].value&&
        i.time === formData['time'].value&&
        i.location === formData['location'].value&&
        i.pain === formData['pain'].value&&
        String(i.fever) === formData['fever'].value&&
        String(i.vomit) === formData['vomiting'].value&&
        String(i.dissy) === formData['dissy'].value&&
        String(i.diarrhea) === formData['diarrhea'].value&&
        String(i.risks) === formData['risk_factors'].value;
}

function matchObjKnee(i) {

let formData = document.theForm.elements;

return  i.age === formData['age'].value&&
        i.gender === formData['gender'].value&&
        i.time === formData['time'].value&&
        i.location === formData['location'].value&&
        i.pain === formData['pain'].value&&
        String(i.fever) === formData['fever'].value&&
        String(i.vomit) === formData['vomiting'].value&&
        String(i.swelling) === formData['swelling'].value&&
        String(i.risks) === formData['risks'].value
}

//Parsing Data Functions
function parseDatasets(d){
  return{
    er: +d.er,
    urgent: +d.urgent,
    primary: +d.primary,
    nothing: +d.nothing,
    recommendation: d['recommendation'],
    age: d['age'],
    blood_stool: d.blood_stool.toLowerCase() == 'true' ? true : false,
    diarrhea: d["diarrhea"].toLowerCase() == 'true' ? true : false,
    fever: d.fever.toLowerCase() == 'true' ? true : false,
    swelling: d.swelling.toLowerCase() == 'true' ? true : false,
    vomit: d.vomit.toLowerCase() == 'true' ? true : false,
    risks: d.risks.toLowerCase() == 'true' ? true : false,
    problem: d['problem'],
    age: d['age'],
    pain: d['pain'],
    time: d['time'],
    location: d['location'],
    gender: d['gender']
  }
}

function parseProviderData(d){
    return{
    provider: d['ProviderName'],
    npi: +d.ProviderNPI,
    cost: +d.CostEstimate,
    code: +d.ServiceCode,
    services: +d.NumberServices,
    description: d.ServiceDescription
  }
}

function parseMedicareData(d){
  return{
    aveSubmittedCharge: +d.average_submitted_chrg_amt,
    aveAllowed: +d.average_medicare_allowed_amt,
    avePayment: +d.average_medicare_payment_amt,
    npi: +d.npi,
    code: +d.hcpcs_code,
    codeDescription: d.hcpcs_description
  }
}

function parseInstanceData(d){
	return{
		abdomen: d.abdomen,
		knee: d.knee,
		head: d.head
	}
}

function getVariableData(){
  return{
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
}};

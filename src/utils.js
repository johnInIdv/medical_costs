import * as d3 from 'd3';

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
  //
	// if(+d.Code >= 900 || dest_name === '') return;
  //
	// delete d.hcpcs_drug_indicator;
  // delete d.nppes_entity_code;
  }
}

function parseInstanceData(d){
	return{
		abdomen: d.abdomen,
		knee: d.knee,
		head: d.head
	}
}

export {
	parseInstanceData,
  parseMedicareData,
  parseProviderData,
  parseDatasets
}

import {
	parameterData,
  headDataPromise,
  abdomenDataPromise,
  kneeDataPromise,
  smallDataPromise
} from './../data2';

function empty(list) {
    list.length = 0;
}
const pickedLabels = [];

function addInput(item,index) {
  var newID = [item,"Input"].join("");
  return newID;
}

export default function FormDisplaySymptoms(){
  let problemPicked;
  let data;
  let formData = [52,3,5];
  let theForm = document.getElementById('symptomsFormLocation');
  let formIDs = [];
  let formElements = [];//an array of parameters arrays
  let formKeys = [];//this is an array of labels

	function exports(){
    document.getElementById("symptomsFormLocation").reset();
      empty(formIDs);
      empty(formElements);
      empty(formKeys);
  	  theForm.innerHTML = '';//clears the form on each selection


    var x;
    for (x in data) {
      // document.getElementById("demo").innerHTML += x + "<br>";
      formKeys.push(x);
      pickedLabels.push(x);
      formElements.push(data[x]);
    }
    formIDs = formKeys.map(addInput);//produces new ID's
    // grab the form div
        // var yt = document.getElementById('abdomenForm');

        for (var i = 0; i < formKeys.length; i++){//runs through all the labels given to that problem
          var lo = document.createElement('div');
              lo.setAttribute('class','form-group');
							lo.setAttribute('class','wrapper-dropdown');
							lo.setAttribute('class','wrapper-dropdown-label');

    // create and add labels
            var w = document.createElement('label');
                w.setAttribute('for','inputVariables');
                // w.setAttribute('class','labels')


            var l = document.createTextNode(formKeys[i]);
						    // l.setAttribute('style','color:red;');
                w.appendChild(l);

    // create and add select element with attribute
            var mj = document.createElement('select');
                mj.setAttribute('id',formIDs[i]);
                mj.setAttribute('name',formKeys[i]);
                mj.setAttribute('class','inputs');
                mj.setAttribute('class','form-control');
								mj.setAttribute('class','wrapper-dropdown-inside');
    // run through the elements to place parameters as options
            for (var j = 0; j < formElements[i].length; j++){
                var s = document.createElement('option');
                var t = document.createTextNode(formElements[i][j]);
                    s.appendChild(t);
                    mj.appendChild(s);//append options to the select element

                    w.appendChild(mj);
                    lo.appendChild(w);
                    theForm.appendChild(lo);
                    //Log UI interactions
//use onsumbit button will send all input info to an object
            }

         }
	    }

    	//Getter/setter methods
      exports.problemPicked = function(_){
    		problemPicked = _;
    		return this;
    	}

    	exports.data = function(_){
    		data = _;
    		return this;
    	}

      exports.selectFormLocation = function(_){
        theForm = _;
        return this;
      }

    	return exports;
}

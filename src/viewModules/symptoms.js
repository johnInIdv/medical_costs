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

export {
  matchObjAbdomen,
  matchObjHead,
  matchObjKnee
}

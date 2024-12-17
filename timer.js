
const request = require('request');
const requestBN = () =>
{ 
  let options = {
    url: "http://localhost:3000/test",
    method: 'get',
  }
  request(options, function(err, response, body){
    console.log("result...",body)
}
  )
}
const interval = setInterval(() =>
{ 
  requestBN()
  
 
}, 5000)
requestBN()
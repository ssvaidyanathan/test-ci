var request = require("request");
var https = require("https");
var fs = require("fs");

//Call Mgmt API
function mgmtAPI(host, port, path, username, password, methodType){
  return new Promise(function (fulfill, reject){
	var data = "";
	var auth = Buffer.from(username+":"+password).toString('base64');
    var options = {
      host: host,
      port: port,
      path: path,
      method: methodType,
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic "+auth
      }
    };
    var req = https.request(options, function(res) {
      if (res.statusCode >= 400 && res.statusCode <= 499) {
      	var maskedOptions = options;
      	maskedOptions.headers.Authorization = "***";
      	console.error(res.statusCode + ": " + res.statusMessage + " with " + JSON.stringify(maskedOptions));
      }
      if (res.statusCode >= 500) {
      	var maskedOptions = options;
      	maskedOptions.headers.Authorization = "***";
        console.error(res.statusCode + ": " + res.statusMessage + " with " + JSON.stringify(maskedOptions));
      }
      res.on("data", function(d) {
          data += d;
      });
      res.on("end", function(){
      	if(data!= "" && options.headers['Content-Type']==='application/json'){
        	fulfill(JSON.parse(data));
      	}
        else {
        	fulfill(data);
        }
      });
    });

    req.on("error", function(e) {
      console.error(e);
    });

    req.end();
  });
}

function getMgmtAPI(host, port, path, username, password){
  return mgmtAPI(host, port, path, username, password, "GET");
}


//Get Deployed revision details for API
function getDeployedRevisionForAPI(host, port, org, env, username, password, api){
  return getMgmtAPI(host, port, "/v1/o/"+org+"/e/"+env+"/apis/"+api+"/deployments", username, password)
    .then(function(response){
      var revision;
      if(response!=null && response.revision!=null && response.revision.length>0){
        revision = response.revision[0].name;
      }
      return revision;
  })
  .catch(function(e){
    console.error("Catch handler getDeployedRevisionForAPI" + e);
    return null;
  });
}

var exportBundle = function(host, port, org, env, username, password, api){
	getDeployedRevisionForAPI(host, port, org, env, username, password, api)
		.then(function(revNumber){
			console.log("Revision Number is : "+ revNumber);
			var uri = "https://"+host+":"+port+"/v1/o/"+org+"/apis/"+api+"/revisions/"+revNumber+"?format=bundle";
			request.get(uri)
				.auth(username, password, false)
				.pipe(fs.createWriteStream(api+'.zip'));
			console.log("Export complete !!!")
		})
		.catch(function(e){
		    console.error("Not a valid API Proxy Name or the Proxy is not deployed"+e);
		    return null;
		  });
};

var myArgs = process.argv.slice(2);
exportBundle(myArgs[0], myArgs[1], 
				myArgs[2], myArgs[3], 
				myArgs[4], myArgs[5], 
				myArgs[6]);

//TO run
//node downloadProxy.js host port org env user pwd api


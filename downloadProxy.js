var request = require("request");
var myArgs = process.argv.slice(2);
var proto = myArgs[0];
var https;
if(proto === "https")
  https = require("https");
else
  https = require ("http");
var fs = require("fs");

//Call Mgmt API
function mgmtAPI(host, port, path, auth, methodType){
  return new Promise(function (fulfill, reject){
  var data = "";
  //var auth = Buffer.from(username+":"+password).toString('base64');
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
        throw new Error(res.statusCode + ": " + res.statusMessage + " with " + JSON.stringify(maskedOptions));
      }
      if (res.statusCode >= 500) {
        var maskedOptions = options;
        maskedOptions.headers.Authorization = "***";
        console.error(res.statusCode + ": " + res.statusMessage + " with " + JSON.stringify(maskedOptions));
        throw new Error(res.statusCode + ": " + res.statusMessage + " with " + JSON.stringify(maskedOptions));
      }
      res.on("data", function(d) {
          data += d;
      });
      res.on("end", function(){
        if(data!= "" && options.headers["Content-Type"]==="application/json"){
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

function getMgmtAPI(host, port, path, auth){
  return mgmtAPI(host, port, path, auth, "GET");
}

function getDeployedRevisionForType(host, port, org, env, auth, name, type_folder){
  return getMgmtAPI(host, port, "/v1/o/"+org+"/e/"+env+"/"+type_folder + "/"+name+"/deployments", auth)
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

var exportBundle = function(proto, host, port, org, env, auth, name, type_folder){
  getDeployedRevisionForType(host, port, org, env, auth, name, type_folder)
    .then(function(revNumber){
      console.log(" ");
      console.log("Revision number is : "+ revNumber);
      //var uri = proto+"://"+host+":"+port+"/v1/o/"+org+"/"+type_folder+"/"+name+"/revisions/"+revNumber+"?format=bundle";
      var uri = proto+"://"+host+"/v1/o/"+org+"/"+type_folder+"/"+name+"/revisions/"+revNumber+"?format=bundle";
      console.log("URI is : "+ uri);
      var options = {
        url: uri,
        headers: {
          "Authorization": "Basic "+ auth
        }
      }
      console.log("Options are : "+ JSON.stringify(options));
      request.get(options)
        //.auth(username, password, false)
        .on('error', function(err) {
          console.log(err)
        })
        .on('response', function(response) {
          console.log("Response code is : "+ response.statusCode);  // 200 
          console.log("Response : "+ JSON.stringify(response));
        })
        .pipe(fs.createWriteStream(name+".zip"));
      console.log("Export successfully completed!")
      console.log(" ");
    })
    .catch(function(e){
        console.error(name + "is not a valid Name for " + type_folder + " or " + name + " is not deployed"+e);
        return null;
      });
};

exportBundle(myArgs[0], myArgs[1], myArgs[2], 
        myArgs[3], myArgs[4], 
        myArgs[5], 
        myArgs[6],
        myArgs[7]);

//TO run
//node downloadProxy.js protocol host port org env auth api


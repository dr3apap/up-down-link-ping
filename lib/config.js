// Enviroment variable for Node


const enviroments = {};

enviroments.staging = {
    "envName": "staging",
    "httpPort"   : 3000,
    "httpsPort"  :3001,
    "hashingSecret":"ProtectandkeepItSave",
}

enviroments.production = {
    "envName": "production",
    "httpPort"   : 5000,
    "httpsPort"  :5001,
    "hashingSecret":"ProtectandkeepItSave",
}


let currEnviroment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase():"";


let envToExport = typeof(enviroments[currEnviroment]) == "object" ? enviroments[currEnviroment]:enviroments["staging"];


module.exports = envToExport;

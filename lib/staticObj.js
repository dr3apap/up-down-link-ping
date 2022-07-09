/*
 * Internal static routines for various task
 *
 * */

// Dependencies
const crypto = require("crypto");
const config = require("./config");

const internalObj = {};

// Create SHA256 hash

internalObj.hash = str => {
    if (typeof(str == "string"))
        return crypto.createHmac("SHA256", config.hashingSecret).update(str).digest('hex');
    return false;
}

internalObj.parseJsonToObj = (str) => {
    try {
       return JSON.parse(str);
    } catch (e){
        return {};
    }
}

module.exports = internalObj;

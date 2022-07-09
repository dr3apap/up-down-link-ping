/**
 * Request Handlers
 *
 * */

/*
 * Dependencies 
 * */
const _data = require("./data");
const fs = require("fs");
const staticObj = require("./staticObj");


const handlers = {};
handlers._users = {};

handlers.users = (data, callback) => {
    let validMethods = ["get", "post", "delete", "put"];
    if (validMethods.includes(data.method)){
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};


handlers._users.get = (data, callback) => {

    if (verifyUser(data.payload.phoneNumber, data.payload.password)){
         callback(200);
    }
};


// User will be given a token to set on first post 
// This will be use for subdsequent request

handlers._users.post = (data, callback) => {
    const { firstName, lastName, phone, tosAgreement, password } = verifyPayload(data.payload);

  if (firstName && lastName && phone && password && tosAgreement){

      _data.read("users", phone, (err, data) => { // check if user already exist


      if(err){ // We couldn't read file so user does not exist

        const hashedPassword = staticObj.hash(password);
        if (hashedPassword){
        const user = {
              firstName,
              lastName,
              password:hashedPassword,
              phone,
              tosAgreement
        }
        _data.create("users", phone, user, (err, data) => {
          if (!err){
            callback(200, {message:"User successfully created"});
          } else {
              console.log(err);
              callback(500, {Error:"There was an error creating user"});
          }
      });

        } else {

            callback(500, {Error:"Could not hash the user's password"}); 
        }
  
          
      } else {
         callback(400, {Error:"A user with that phone number already exist"}); 

        }

      });
      
  } else {
      callback(400, {Error:"Missing required fields"});
  }

};

// TODO:Let user set client token for aunthentication
// User will be given a token to set when they first register
// This token is sent with every subdsequent request
handlers._users.get = (data, callback) => {
    const { phone } = data.payload;
                if (verifyPhone(phone)){

      _data.read("users", parsedPhone, (err, data) => {
          if (!err && data){
              // Remove the hashedPassword from response payload
              delete data.hashedPassword;
              callback(200,data);
             //  let validPassword = staticObj.hash(data.payload.password);
             // if (validPassword == data.password){
             //     delete data.hashedPassword;
             //     callback(data);

             // } else {
             //     callback(400, {Error:"The password provided does not match"});
             // }
          } else {
              callback(404, {Error:"Sorry the user does not exist"});
          }
      });
         } else {
             callback(404, {Error:"Missing required field"});
         }
};

// TODO:Make sure user are authorized to delete objec
handlers._users.delete = (data, callback) => {
    const { phone } = data.payload;
if (verifyPhone(phone)){
    _data.read("users", phone, (err, data) => {
        if (!err){
            _data.delete("users", phone, (err) => {
                if(!err){
                 callback(200, {message:"User successfully deleted"});
                } else {
                    callback(500, {Error:"Couldn't delete user"});
                }
            });
        } else {
        callback(405, {Error:"Couldn't delete user, user does not exist"});
        }
    });
      
} else {
    callback(405, {Error:"Missing required field"});
    }
}

// TODO: make sure user can only update their object
// User need to send a token in with request
handlers._users.put = (data, callback) => {
    const { firstName, lastName, password, phone } = data.payload; 
    if (verifyPhone(phone)){ 
        if (lastName || firstName || password){

        _data.read("users", phone, (err, dataObj) => {
            if (!err && dataObj){
                if (lastName)
                    dataObj.lastName = lastName;
                if (firstName)
                    dataObj.firstName = firstName;
                if (password){
                    dataObj.password = staticObj.hash(password);
                }

                _data.update("users", phone, dataObj, (err, data) => {
                    if(!err){ 
                        callback(200, {message:"User updated successfully"});
                    } else {
                        callback(500, {Error:"Couldn't update user"});
                    }
                });
            } else {
                callback(400, {Error:"Couldn't update user, user does not exist"});
            }
        });
            } else {
                callback(400, {Error:"Missing data to update"});
            }
      
    } else {
        callback(400, {Error:"Missing required field"});
    }

}
  


function verifyUser(userPhone, userPassword){

       let validPassword; 
       let validUser = false;

    _data.read("users", userphone, (err, data) => {
        if (!err) 
            validPassword = data.password;
    });

    if (validPassword && (userPassword == validPassword))
        validUser = true;
    return validUser;

}

const verifyPayload = (payloadObj) => {
    
let firstName = /[A-Za-z]{1,30}/.test(payloadObj.firstName) ? payloadObj.firstName : false;
let lastName = /[A-Za-z]{1,30}/.test(payloadObj.lastName) ? payloadObj.lastName : false;
 // TODO: match the password string with a plaintext then reject by asking it must have one
// number and symobl character (terse to wrirte a constraint without user friendly notification;
// Reject all plain text, number and symobl

let password = /^([\w!@#%$&*])\w{1,7}(\d|[!@#%$&*])?[A-Za-z]{1,4}(\d|[!@#%$&*])?$/.test(payloadObj.password) ? payloadObj.password : false;

let phone = /^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(payloadObj.phone) ? payloadObj.phone:false;
let tosAgreement = /true/.test(payloadObj.tosAgreement) ? payloadObj.tosAgreement : false
    return {
             firstName,
             lastName,
             password,
             tosAgreement,
             phone
    }
}

const verifyPhone = (phone) => {
    return /^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(phone)? phone : false;

}


// Define handlers

// Not found handler
handlers.notFound = (data, callback) => { 
    callback(404);
};


// Ping handler
handlers.ping = (data, callback) => {
    callback(200);
}


// Export the module
module.exports = handlers;

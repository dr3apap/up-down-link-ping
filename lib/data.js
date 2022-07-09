// Library for storing and editing data

// Dependecies

const fs = require("fs");
const path = require("path");
const staticObj = require("./staticObj");

// Namespace for module

const lib  = {};

// Base directory of the folder 
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to a file 
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx', (err, fileDescriptor) => {
        //console.log(lib.baseDir+dir+'/'+file+'.json');
        if (!err && fileDescriptor){
            // convert data to string 
            let stringData = JSON.stringify(data);

            // Write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err){
                    fs.close(fileDescriptor, (err) => {
                        if (!err){
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    });

                    } else {
                        callback("Error writing to new file");
                    }
            });
        } else {
            callback("Could not create new file, it may already exist");
        }
    });

};

// Read data from a file 

lib.read = (dir, file, callback) => {
        fs.readFile(lib.baseDir+dir+'/'+file+".json", "utf-8",  (err, data) => {
            if (!err && data){
                callback(err, staticObj.parseJsonToObj(data));
            } else {
                callback(err, data);
            }
        });
};

// Update data inside file 

lib.update = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.baseDir+dir+'/'+file+".json", "r+", (err, fileDescriptor) => {
        if (!err && fileDescriptor){
            // convert data to string
            let stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err){
                    // Update file and close it 
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err){
                            fs.close(fileDescriptor, (err) => {
                                if (!err){
                                  callback(false, "File successfully updated\n");
                                } else {
                                    callback("Error closing file\n");
                                }
                            });
                        } else {
                            callback("Error updating file\n");
                        }
                    });

                } else {
                    callback("Error truncating file\n");
                }

            });
        } else {
            callback("Could not open the file for updating, it may not exist\n");
        }
    });
};
    

lib.delete = (dir, file, callback) => {
    fs.rm(lib.baseDir+dir+'/'+file+".json", (err) => {
        if (!err){
            callback(false);
        } else {
            callback("Error deleting file");
        }
    });
}


// Export module 
module.exports = lib;

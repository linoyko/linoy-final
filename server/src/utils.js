const fs = require('fs');

/**
 * 
 * Utils functions
 */

/**
 * Saving json to file
 * 
 * @param {string} path 
 * @param {JSON} data 
 */
function saveJSONtoFile(path, data){
  try{
    fs.writeFileSync(path, JSON.stringify(data));
  }
  catch(err){
    console.error(`Failed savind data to ${path}: ${err.message}`)
  }
}

/**
 * Getting json from path
 * 
 * @param {string} path 
 */
function getJSONfromFile(path){
  try{
    const buffer = fs.readFileSync(path);
    return JSON.parse(buffer)
  }
  catch(err){
    console.error(`Failed reading data from ${path}: ${err.message}`)
  }
}

module.exports = {
  saveJSONtoFile,
  getJSONfromFile
}
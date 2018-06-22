
var filepath  = require('../tools/config').filepath;
const readFile = require("../tools/utils").readFile;
 const getFIleArr = ( req, res, next )=> {
     return new Promise((resolve, reject) => {
         readFile(filepath, function( dirArr ){
             resolve( dirArr );
         });
     })
}
module.exports = getFIleArr;

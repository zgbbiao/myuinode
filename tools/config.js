const path = require("path");
var filepath =  path.normalize("./ui/pages");
var createFilePath = path.normalize('./mobile');
var indexFilePath = path.normalize("./ui/index.html");
// var filepath = "./ui/pages";

module.exports = {
    filepath,
    createFilePath,
    indexFilePath
}
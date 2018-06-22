var express = require('express');
var router = express.Router();
const path = require("path");
var getFileArr = require("../model/getFileArr.js");
const utils =  require("../tools/utils")
const readFileContent = utils.readFileContent;
const createMkDir = utils.createMkDir;
const _CONFIG = require("../tools/config.js");
const createFilePath = _CONFIG.createFilePath
const indexFilePath = _CONFIG.indexFilePath
/* GET home page. */
router.get('/', async function(req, res, next) {
    var obj = await getFileArr(req, res, next);
    var contentArr = {};
    var myDirectoryThree = new Map();
    // 取出文件， 生成文件目录树；
    for( let key in obj ) {
        var val = obj[key];
        if ( val ) {
            if ( val.isDirectory ) {
                if ( !myDirectoryThree.has( key ) ){
                    var valObj = Object.assign( val );
                    valObj.children  = [];
                    myDirectoryThree.set( key, valObj );
                }
            } else {
                var keyarr = key.split("/");
                delete keyarr[keyarr.length-1];
                var keystr = keyarr.join("/").slice(0,-1);
                var valObj = val;
                if ( !myDirectoryThree.has( keystr ) ){
                    valObj.children  = [];
                    valObj.children.push( JSON.stringify(valObj) );
                    myDirectoryThree.set( key, valObj );
                } else {
                    var directoryArr = myDirectoryThree.get( keystr );
                    directoryArr.children.push( JSON.stringify(valObj) );
                    myDirectoryThree.set( keystr, directoryArr);
                }
            }
        }

    }
    // 取出文件内容，  拿出文件内容树
    var contentObj = {};
    for ( let [key, value] of myDirectoryThree ) {
        contentObj[key]  = []
        for ( let key2 in  value.children ) {
            var value2 = value.children[key2];
            var value2Obj = JSON.parse(value2);
            contentObj[key].push( await readFileContent(value2Obj.path) )
        }
    }
    console.log(contentObj);
    console.log([...myDirectoryThree.values()]);
    var indexhtmlObj =  await readFileContent(indexFilePath)
    console.log(indexhtmlObj);
    // _CONFIG  createFilePath
    for( let key in contentObj ) {
        console.log("ddd");
        console.log( path.join(createFilePath, key.split("/")[(key.split("/").length-1)]) );
        var createState=  await createMkDir( path.join(createFilePath, key.split("/")[(key.split("/").length-1)]) );
        if ( createState.newDirectory ){

        }
        console.log(createState);
    }

    res.render('index', { title: 'Express', content: "content" });
});

module.exports = router;

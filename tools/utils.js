const fs = require('fs');
const path = require("path");

/*
*   读取文件目录
* @params  path<string>:  文件根路径，
* @params  callback<function>， 返回已有路径的数组，    Object.noDirectory: 文件， Object.Directory： 文件夹
* @params  dirObj<array>: 数组；
* */
function readFile(filepath, callback, dirObj){
    var dirObj = dirObj || {};
    var filepath2 = filepath;
        fs.readdir(filepath2, (err, files)=> {
            if ( err ) throw err;
            for ( let i=0, file; file=files[i++]; ) {
                if (file) {
                    var filepath =  filepath2 + "/" + file;
                    var extname = path.extname(filepath);
                    if ( extname ) {
                        dirObj[filepath] = {
                            isDirectory: false,
                            path: filepath
                        }
                    } else {
                        dirObj[filepath] = {
                            isDirectory: true,
                            path: filepath
                        }
                    }
                    fs.stat( filepath, (err2, stats) => {
                        if (err2) throw err2;
                        if ( stats.isDirectory() ) {
                            readFile && readFile(filepath, callback, dirObj )
                        } else {
                            if ( files.length <= i ) {
                                callback && callback(dirObj);
                            }
                        }
                    })
                }
            }
        })
}

/*
*   读取文件内容
*   @params<string>:  目录路径
* */

const readFileContent = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) throw Error(`没有读取到${filepath}文件`);
            var extname = path.extname(filepath);  //读取路径后缀；
            resolve({
                type: extname.slice(1),
                content: data.toString()
            });
        })
    })
}

/*
* 创建文件夹
* @params <mkdirPath>: 文件夹路径
* @return <object>: object.isDirectory: false 表示曾经不存在改文件夹，  true，表示曾经存在，  create： success: 创建成功， fail 创建失败；
* */

const createMkDir = ( mkdirPath ) => {
    return new Promise((resolve, reject) => {
        console.log(mkdirPath);

        // 检查文件是否存在于当前目录。
        fs.access(mkdirPath, fs.constants.F_OK, (err) => {
            // console.log(`${mkdirPath} ${err ? '不存在' : '存在'}`);
            if ( err ) {
                fs.mkdir(mkdirPath, err2=> {
                    if (err2) throw err2;
                    resolve( {
                        newDirectory: true,
                        state: "success"
                    } );
                })
            } else {
                resolve( {
                    ordDirectory: true,
                    state: "fail"
                } );
            }
        });
    })
}




module.exports = {
    readFile: readFile,
    readFileContent: readFileContent,
    createMkDir
}
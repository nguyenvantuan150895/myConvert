const exec = require('child_process').exec;
const jsonfile = require("jsonfile");

class PngConverter {
    constructor(doc_id, tmp_path, output_path) {
        this.doc_id = doc_id;
        this.tmp_path = tmp_path;
        this.output_path = output_path;
    }

    convert() {
        return new Promise((resolve, reject) => {
            let output_path = this.output_path;
            let doc_id = this.doc_id;
            this.convertPng2svg(this.tmp_path, this.output_path).then(function (converted) {
                var meta_file = output_path + '/meta.docs';
                var obj = {
                    status: true,
                    origin: "/document/" + doc_id + '/meta.docs',  
                    pages: converted.pages,
                    base_url: "/document/" + doc_id,
                    types: ['png']
                }

                jsonfile.writeFile(meta_file, obj, function (err) {
                    resolve(obj);
                })
            }, function (err2) {
                reject(err2);
            })
        });
    }

    convertPng2svg(in_file, out_path) {
        // out_path = this.output_path;
        console.log("OUT_PATH:", out_path);
        return new Promise((resolve, reject) => {
            let cmd = 'mkdir -p ' + out_path + '; convert ' + in_file + ' -density 300 ' + out_path + '/page_1.png';
            console.log("CMD: ", cmd);
            exec(cmd,
                (error, stdout, stderr) => {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        reject(error);
                    }

                    resolve({
                        pages: 1
                    });
                });
        });
    }
}

module.exports = PngConverter;
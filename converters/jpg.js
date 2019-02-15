const exec = require('child_process').exec;
const jsonfile = require("jsonfile");

class JpgConverter {
    constructor(doc_id, tmp_path, output_path) {
        this.doc_id = doc_id,
        this.tmp_path = tmp_path;
        this.output_path = output_path;
    }

    convert() {
        return new Promise((resolve, reject) => {
            let output_path = this.output_path;
            let doc_id  = this.doc_id;
            this.convertPng2svg().then(function (converted) {
                var meta_file = output_path + '/meta.docs';
                var obj = {
                    status: true,
                    origin: "/document/" + doc_id + '/meta.docs',
                    pages: converted.pages,
                    base_url: "/document/" + doc_id,
                    types: ['jpg']
                }

                jsonfile.writeFile(meta_file, obj, function (err) {
                    resolve(obj);
                })
            }, function (err2) {
                reject(err2);
            })
        })
    }

    convertPng2svg() {
        return new Promise((resolve, reject) => {
            exec('mkdir -p ' + this.output_path + '; convert ' + this.tmp_path + ' -strip -quality 75 ' + this.output_path + '/page_1.jpg',
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

module.exports = JpgConverter;
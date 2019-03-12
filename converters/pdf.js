const exec = require('child_process').exec;
const jsonfile = require("jsonfile");
const fs = require("fs"); //Load the filesystem module
const Config = require("../config");

class PdfConverter {
    constructor(doc_id, tmp_path, output_path, callback, logger) {
        this.doc_id = doc_id;
        this.tmp_path = tmp_path;
        this.output_path = output_path;
        this.callback = callback;
        this.logger = logger;
    }

    async convert() {
        this.logger(`[${this.doc_id}] start convert`);
        let total_page = await this.getTotalPage();
        this.logger(`[${this.doc_id}] total page: ${total_page}`);
        let task_complete = 0;
        let total_task = total_page * 2 + 1;
        let result_convert = [];
        let types_page = undefined;


        this.logger(`[${this.doc_id}] devision page...`);
        let start_time = new Date().getTime();
        let devision_pdf = await this.devisionPdf();
        if (devision_pdf.status == true) {
            task_complete++;
            this.callback(Math.floor((task_complete / total_task) * 100), undefined,
                types_page, total_page);
        }
        for (let i = 1; i <= total_page; i++) {
            // pdf -> svg
            let cv_svg = await this.convertPDFtoSVG(i);
            if (cv_svg.status == true) {
                task_complete++;
                this.callback(Math.floor((task_complete / total_task) * 100), undefined,
                    types_page, total_page);
                // svg -> png
                // let cv_png = await this.convertSVGtoPNG(i);
                // console.log("Print CV_PNG:", cv_png);
                let cv_png = await this.convertPDFtoPNG(i);
                if (cv_png.status == true) {
                    result_convert.push(cv_png);
                    task_complete++;
                    //get types data
                    types_page = this.getTypesPage(cv_png);
                    this.callback(Math.floor((task_complete / total_task) * 100), i,
                        types_page, total_page);
                }
            }
        }
        this.logger(`[${this.doc_id}] convert finish`);
        let end_time = new Date().getTime();
        console.log("Total time:", end_time - start_time);
        let types = await this.getTypeData(result_convert);
        await this.saveFileMeta(total_page, types);
        this.logger(`[${this.doc_id}] build meta data.`);
    }

    getTotalPage() {
        return new Promise((resolve, reject) => {
            exec('pdftk ' + this.tmp_path + ' dump_data | grep NumberOfPages', (error, stdout, stderr) => {
                let pages = parseInt(stdout.replace("NumberOfPages: ", ""));
                if (error) reject({ get_total_page: "fail", msg: error });
                else resolve(pages);
            });
        });
    }

    devisionPdf() {
        return new Promise((resolve, reject) => {
            exec('mkdir -p ' + this.output_path + '; pdftk ' + this.tmp_path + ' burst output ' + this.output_path + '/page_%d.pdf',
                (error, stdout, stderr) => {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                        reject({ status: false, msg: error });
                    }
                    else {
                        resolve({ status: true })
                    }
                }
            );
        })
    }

    convertPDFtoSVG(page_current) {
        this.logger(`[${this.doc_id}] Converting: ${page_current}`);
        let i = page_current;
        let input = this.output_path + "/page_" + i + ".pdf";
        let output = this.output_path + "/page_" + i + ".svg";
        return new Promise(function (resolve, reject) {
            // let cmd = 'ln -s ' + input + ' ' + input + '.optimize.pdf'
            //     //+ ';gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook  -dNOPAUSE  -dBATCH -sOutputFile=' + in + '.optimize.pdf ' +  in + '.optimize.pdf'
            //     // + ';inkscape --without-gui --file=' + input + '.optimize.pdf' + ' --export-plain-svg=' + out_file
            //     + '; pdf2svg ' + input + '.optimize.pdf' + ' ' + output
            //     //+ "; svgo " + output + " " + out + ".min.svg" 
            //     + "; cat " + output + " | gzip > " + output + "z";
            let cmd = `ln -s ${input} ${input}.optimize.pdf; pdf2svg ${input}.optimize.pdf ${output};` +
            `cat ${output} | gzip > ${output}z;`
            console.log("[Excute PDF->SVG] " + cmd);
            exec(cmd, function (error, stdout, stderr) {
                console.log(stdout);
                if (error) {
                    resolve({
                        file: input,
                        status: false
                    });
                    return;
                }
                let stats = fs.statSync(output);
                resolve({
                    file: input,
                    status: true,
                    size: stats.size
                });
            });
        });
    }

    convertSVGtoPNG(page_current) {
        let i = page_current;
        let input = this.output_path + "/page_" + i + ".svg";
        let output = this.output_path + "/page_" + i + ".png";
        return new Promise(function (resolve, reject) {
            let cmd = 'convert -density 200 -resize 1024x1024 ' + input + ' ' + output;
            if (Config.USING_RSVG_PNG) {
                console.log('Use srgv');
                cmd = `rsvg  -w 1024 -h 1024 ${input} ${output}`;
                // console.log("CMD:", cmd);
            } else {
                console.log('Use density');
            }
            // console.log("[Excute] " + cmd);
            exec(cmd, function (error, stdout, stderr) {
                console.log(stdout);
                if (error) {
                    resolve({
                        file: error,
                        status: false
                    });
                    return;
                }
                resolve({
                    file: input,
                    status: true
                });
            });
        });
    }

    convertPDFtoPNG(page_current) {
        let i = page_current;
        let input = this.output_path + "/page_" + i + ".pdf";
        let output = this.output_path + "/page_" + i;
        return new Promise(function (resolve, reject) {
            console.log('Use pdftoppm');
            let cmd = `pdftoppm ${input} ${output} -png -f 1 -singlefile`;
            // console.log("CMD:", cmd);

            // console.log("[Excute] " + cmd);
            exec(cmd, function (error, stdout, stderr) {
                console.log(stdout);
                if (error) {
                    resolve({
                        file: error,
                        status: false
                    });
                    return;
                }
                resolve({
                    file: input,
                    status: true
                });
            });
        });
    }

    getTypeData(result_convert) {
        let over_size_pages = result_convert.filter((page) => {
            return page != undefined && page.size != undefined && page.size > 2 * 1024 * 1024; //2MB 
        });
        if (over_size_pages.length == 0) {
            return ['svgz', 'png', 'svg', 'pdf'];
        } else {
            return ['png', 'svgz', 'svg', 'pdf'];
        }
    }

    async saveFileMeta(pages, types) {
        let meta_file = this.output_path + '/meta.docs';
        let obj = {
            status: 'converted',
            origin: "/document/" + this.doc_id + '/meta.docs',
            pages: pages,
            base_url: "/document/" + this.doc_id,
            types: types
        }
        return new Promise((resolve, reject) => {
            jsonfile.writeFile(meta_file, obj, function (err) {
                if (err) return reject(err);
                else resolve({ status: true });
            })
        })
    }

    getTypesPage(page) {
        if (page != undefined && page.size != undefined && page.size > 2 * 1024 * 1024) {
            return ['png', 'svgz', 'svg', 'pdf'];
        }
        else {
            return ['svgz', 'png', 'svg', 'pdf'];
        }

    }

}

module.exports = PdfConverter;
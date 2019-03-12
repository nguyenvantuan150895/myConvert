const PdfConverter = require("../converters/pdf");
const Config = require("../config");
// const redisAdapter = require('socket.io-redis');

class ConvertPdfWorker {
    constructor(storage, io) {
        this.storage = storage;
        this.io = io;
    }

    async process(job, done) {
        this.job = job;
        this.doc_id = job.data.doc_id;
        this.done = done;
        let doc_path = job.data.doc_path;
        let out_path = `${Config.DOC_PATH}/storage/document/${this.doc_id}`;
        let converter = new PdfConverter(this.doc_id, doc_path, out_path, async (percent, page_done, types, total_page) => {
            this.callback(percent, page_done, types, total_page);
        }, this.log.bind(this));
        try{
            await converter.convert();
        } catch(e) {
            console.log(e);
        }
    }

    async callback(percent, page_done, types, total_page) {
        console.log("Progress:", percent);
        this.job.progress(percent, 100);
        await this.storage.set(this.doc_id, { progress: percent });
        if(Number(percent) == 100) this.done();
        if(page_done != undefined && types != undefined) {
            this.io.sockets.in('document_' + this.doc_id).emit('progress',{
                page_done: page_done,
                types: types,
                total_page: total_page
            });
            await this.storage.set(this.doc_id, { types: types.toString()});
            await this.storage.set(this.doc_id, { page_done: page_done });
        }
    }
    
    log(str) {
        console.log(str);
        this.job.log(str);
    }
}

module.exports = ConvertPdfWorker;
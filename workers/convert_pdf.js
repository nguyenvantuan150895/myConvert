const PdfConverter = require("../converters/pdf");
const redisAdapter = require('socket.io-redis');

class ConvertPdfWorker {
    constructor(storage, io) {
        this.storage = storage;
        this.io = io;
    }

    async process(job, done) {
        let doc_id = job.data.doc_id;
        let doc_path = job.data.doc_path;
        let out_path = `/tmp/storage/document/${doc_id}`;
        let converter = new PdfConverter(doc_id, this.storage, doc_path, out_path, async (percent, page_done) => {
            // console.log("Progress:", percent);
            await this.storage.set(doc_id, { progress: percent });
            if(Number(percent) == 100) done();
            if(page_done != undefined) {
                this.io.to('document_' + doc_id).emit('progress', page_done);
                await this.storage.set(doc_id, { page_done: page_done });
            }
        });
        try{
            await converter.convert();
        } catch(e) {
            console.log(e);
        }
    }
}

module.exports = ConvertPdfWorker;
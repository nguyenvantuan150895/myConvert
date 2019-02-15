const JpgConverter = require("../converters/jpg");
class ConvertJpgWorker {
    constructor(storage, io) {
        this.storage = storage;
        this.io = io;
    }

    async process(job, done) {
        let doc_id = job.data.doc_id;
        let doc_path = job.data.doc_path;
        let out_path = `/tmp/storage/document/${doc_id}`;
        let converter = new JpgConverter(doc_id, doc_path, out_path);
        let rs = await converter.convert();
        if(rs.status == true) {
            job.progress(100, 100);
            await this.storage.set(doc_id, {progress: 100});
            done();
            this.io.sockets.in('document_' + doc_id).emit('progress',{
                page_done: 1,
                types: ['jpg']
            });
            await this.storage.set(doc_id, { types: ['jpg'].toString()});
            await this.storage.set(doc_id, { page_done: 1 });
        }
    }
}

module.exports = ConvertJpgWorker;
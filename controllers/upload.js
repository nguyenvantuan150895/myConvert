const debug = require('debug')('action::upload')
const uuidv1 = require('uuid/v1');
const Config = require("../config");
const exec = require('child_process').exec;


function AsyncMv(doc, path) {
    return new Promise((resolve, reject) => {
        doc.mv(path, (err) => {
            if(err) {
                return reject(err);
            }
            resolve();
        })
    })
}

function buildDocFile(doc_id, doc) {
    let doc_path = null;
    let doc_type = null;

    switch(doc.mimetype){
        case "image/png":
            doc_path = `${Config.DOC_PATH}/storage/upload/${doc_id}.png`;
            doc_type = "png";
            break;
        case "image/jpeg":
            doc_path = `${Config.DOC_PATH}/storage/upload/${doc_id}.jpg`;
            doc_type = "jpg";
            break;    
        case "image/jpg":
            doc_path = `${Config.DOC_PATH}/storage/upload/${doc_id}.jpg`;
            doc_type = "jpg";
            break;        
        case "application/pdf":
            doc_path = `${Config.DOC_PATH}/storage/upload/${doc_id}.pdf`;
            doc_type = "pdf";
            break;
    }
    
    return {path: doc_path, type: doc_type};
}

function createJobAsync(queue, name, opts) {
    return new Promise((resolve, reject) => {
        queue.create(name, opts).save((err) => {
            if(err) {
                return reject(err);
            }
            resolve();
        });
    })
}


function getTotalPage(doc_path) {
    return new Promise((resolve, reject) => {
        exec('pdftk ' + doc_path + ' dump_data | grep NumberOfPages', (error, stdout, stderr) => {
            let pages = parseInt(stdout.replace("NumberOfPages: ", ""));
            if (error) resolve(1);
            else resolve(pages);
        });
    });
}


class UploadAction {
    constructor(storage, queue) {
        this.storage = storage;
        this.queue = queue;
    }

    async process(req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
        let doc = req.files.doc;
        console.log(doc);

        //generate uuid
        let doc_id = uuidv1();
        let doc_file = buildDocFile(doc_id, doc);
        debug("Save file: %s %o", doc_id, doc_file);
        await AsyncMv(doc, doc_file.path);
        await this.storage.set(doc_id, doc_file);

        await createJobAsync(this.queue, `convert_${doc_file.type}`, {
            title: `Convert  ${doc_id} ${doc.name} ${doc_file.path}`,
            doc_id: doc_id,
            doc_path: doc_file.path
        });
        let total_page = await getTotalPage(doc_file.path);
        res.json({ 
            status: true,
            doc_id: doc_id,
            origin: "/document/" + doc_id + '/meta.docs',
            base_url: "/document/" + doc_id,
            total_page: total_page
        });
    }
}

module.exports = UploadAction;
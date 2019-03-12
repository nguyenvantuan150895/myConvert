// const redisAdapter = require('socket.io-redis');

class Socket {
    constructor(io, storage) {
        this.io = io;
        this.storage = storage;
    }

    async listen() {
        this.io.on('connection', (socket) => {
            socket.on('regis_document', async (doc_id, fn) => {
                console.log("doc_id receive from client:", doc_id);
                let document = await this.storage.get(doc_id, ['path']);
                let total_page = await this.storage.get(doc_id, ['total_page']);
                if (document[0] == null) {
                    fn({ status: false, msg: 'id not found' });
                } else {
                    let page_done = await this.storage.get(doc_id, ["page_done"]);
                    let types = await this.storage.get(doc_id, ["types"]);
                    page_done = page_done[0] || 0;
                    types = types[0] || [];
                    if(typeof types == 'string') types = types.split(",");
                    total_page = total_page[0] || 0;
                    socket.join('document_' + doc_id);
                    fn({status: true,page_done: page_done, types: types, total_page: parseInt(total_page)});
                }
            });
        });
    }
}

module.exports = Socket;











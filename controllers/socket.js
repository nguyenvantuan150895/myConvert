const redisAdapter = require('socket.io-redis');

class Socket {
    constructor(io, storage) {
        this.io = io;
        this.storage = storage;
    }

    async listen() {
        this.io.on('connection', (socket) => {
            socket.on('regis_document', async (data, fn) => {
                console.log("data receive from client:", data);
                let page_done = await this.storage.get(data.doc_id, ["page_done"]);
                let types = await this.storage.get(data.doc_id, ["types"]);
                page_done = page_done[0] || 0;
                types = types[0] || [];
                socket.join('document_' + data.doc_id);
                fn({page_done: page_done, types: types});
            });
        });
    }
}

module.exports = Socket;











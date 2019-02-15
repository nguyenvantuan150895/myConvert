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
                let last_page_event = await this.storage.get(data.doc_id, ["page_done"]);
                // last_page_event = {
                //     type: ['pdf', 'png'],

                // }
                last_page_event = last_page_event[0];
                socket.join('document_' + data.doc_id);
                fn(last_page_event);
            });
        });
    }
}

module.exports = Socket;
















// const Config = require('../config.js');

// async function getProgress(doc_id, storage) {
//     return new Promise(async (resolve, reject) => {
//         let job_info = await storage.get(doc_id, ["progress"]);
//         let path = await storage.get(doc_id, ["path"]);
//         let type = await storage.get(doc_id, ["type"]);
//         let total_page = await storage.get(doc_id, ["total_page"]);
//         // let total_page = [0];
//         let page_done = await storage.get(doc_id, ["page_done"]);
//         if (page_done[0] == null) page_done = null;
//         else page_done = page_done[0];
//         // console.log("PATH:", path);
//         if (job_info[0] == null) { job_info[0] = 0 }
//         if (path[0] != null && path.length > 0) {
//             resolve({
//                 status: true,
//                 total_page: total_page[0],
//                 origin: "/document/" + doc_id + '/meta.docs',
//                 base_url: "/document/" + doc_id,
//                 progress: job_info[0],
//                 path: path[0],
//                 type: type[0],
//                 page_done: page_done
//             });
//         } else {
//             reject({ status: false, err: "id not found" });
//         }
//     })
// }

// async function handleProgress(doc_id, storage, io, socket) {
//     socket.join(doc_id);
//     socket.my_room = doc_id;
//     let percent = 0;
//     let my_interval = setInterval(async () => {
//         let ob_progress = await getProgress(doc_id, storage);
//         if (Number(ob_progress.progress) != percent) {
//             // socket.emit('info-progress', ob_progress);
//             io.sockets.in(socket.my_room).emit('info-progress', ob_progress);
//             percent = Number(ob_progress.progress);
//         }
//         if (ob_progress.status == true && Number(ob_progress.progress) == 100) {
//             clearInterval(my_interval);
//         }
//     }, 100)
// }

// async function getPage(doc_id, page, storage, io, socket) {
//     socket.join(doc_id + "/page" + page);
//     socket.my_room_page = doc_id + "/page" + page;
//     let my_interval = setInterval(async () => {
//         let page_done = await storage.get(doc_id, ["page_done"]);
//         let total_page = await storage.get(doc_id, ["total_page"]);
//         console.log('TONG-PAGE:', total_page);
//         console.log('TRANG-DONE:', page_done);
//         if(page > Number(total_page[0])) {
//             console.log("OVER");
//             io.sockets.in(socket.my_room_page).emit('info-page', { status:'not found'});
//             clearInterval(my_interval);
//         }
//         else if (page > Number(page_done[0])) {
//             console.log("MAX");
//             io.sockets.in(socket.my_room_page).emit('info-page', { status: false });
//         }
//         else {
//             console.log("MIN");
//             let path_pdf = `/document/${doc_id}/page_${page}.pdf`;
//             let path_png = `/document/${doc_id}/page_${page}.png`;
//             let path_svg = `/document/${doc_id}/page_${page}.svg`;
//             let ob = {
//                 status: true,
//                 path_pdf: path_pdf,
//                 path_png: path_png,
//                 path_svg: path_svg
//             }
//             io.sockets.in(socket.my_room_page).emit('info-page', ob);
//             clearInterval(my_interval);
//         }
//     }, 1000);
// }
// // Init class
// class Socket {
//     constructor(io, storage) {
//         this.io = io;
//         this.storage = storage;
//     }

//     async listen() {
//         this.io.on("connection", async (socket) => {
//             socket.on("get-progress", async (doc_id) => {
//                 await handleProgress(doc_id, this.storage, this.io, socket);
//             });

//             socket.on('disconnect', function () {
//                 socket.leave(socket.my_room);
//             });

//             socket.on('get-page', async (data) => {
//                 await getPage(data.doc_id, data.page, this.storage, this.io, socket);
//             })
//         });
//     }
// }
// module.exports = Socket;

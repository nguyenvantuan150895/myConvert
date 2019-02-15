const kue = require('kue');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
const bodyParser = require('body-parser');

//workers
const ConvertPngWorker = require("./workers/convert_png");
const ConvertPdfWorker = require("./workers/convert_pdf");
const ConvertJpgWorker = require("./workers/convert_jpg");

//services
const RedisStorage = require("./utils/redis_storage");
const redis_storage = new RedisStorage(Config.REDIS_URI);
const queue = kue.createQueue({
    //prefix: 'q',
    redis: { url: Config.REDIS_URI }
});

// Socket
app.set('view engine', 'ejs');
const Socket = require("./controllers/socket.js");

//body parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//actions
const UploadAction = require("./controllers/upload");

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());

// default options 
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(fileUpload());
//get
app.get('/upload', (req, res) => {
    res.render('home');
})
//post
app.post('/upload', async (req, res) => {
    let action = new UploadAction(redis_storage, queue);
    try {
        await action.process(req, res);
    } catch (e) {
        res.json({ status: false, err: e.toString() });
    }
});

app.get(/.svgz/, function (req, res, next) {
    res.set({ 'Content-Encoding': 'gzip' });
    next();
});

app.use(express.static('/tmp/storage/'));
app.use(express.static(__dirname + '/public'));

async function bootup() {
    await redis_storage.connect();
    // app.listen(3000);
    server.listen(3000);
    kue.app.listen(3003);

    const socket = new Socket(io, redis_storage);
    await socket.listen();

    queue.process('convert_pdf', (job, done) => {
        let worker = new ConvertPdfWorker(redis_storage);
        worker.process(job, done);
    });

    queue.process('convert_png', (job, done) => {
        let worker = new ConvertPngWorker(redis_storage);
        worker.process(job, done);
    });

    queue.process('convert_jpg', (job, done) => {
        let worker = new ConvertJpgWorker(redis_storage);
        worker.process(job, done);
    });
}

bootup();











// app.get('/document/job/:id', async (req, res) => {
//     try {
//         let id = req.params.id;
//         let job_info = await redis_storage.get(id, ["progress"]);
//         let path = await redis_storage.get(id, ["path"]);
//         let type = await redis_storage.get(id, ["type"]);
//         console.log("PATH:", path);
//         if (job_info[0] == null) { job_info[0] = 0 }
//         if (path[0] != null && path.length > 0) {
//             res.json({
//                 status: true,
//                 origin: "/document/" + id + '/meta.docs',
//                 base_url: "/document/" + id,
//                 progress: job_info[0],
//                 path: path[0],
//                 type: type[0]
//             });
//         } else {
//             res.json({ status: false, err: "id not found" });
//         }
//     } catch (e) {
//         res.json({ status: false, err: e.toString() });
//     }
// });
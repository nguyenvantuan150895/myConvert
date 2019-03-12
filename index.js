const kue = require('kue');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { path: '/document/socket.io'});
const fs = require("fs");

// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
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

// upload
app.get('/upload', (req, res) => {
    res.render('upload');
})

app.post('/upload', async (req, res) => {
    let action = new UploadAction(redis_storage, queue);
    try {
        await action.process(req, res);
    } catch (e) {
        res.json({ status: false, err: e.toString() });
    }
});

// view page convert
app.get('/view', async (req, res) => {
    res.render('convert');
})

app.get('/document/job/:id',(req, res) => {
    try {
        let doc_id = req.params.id;
        let rs = fs.readFileSync(`${Config.DOC_PATH}/storage/document/${doc_id}/meta.docs`);
        rs = JSON.parse(rs.toString());
        res.json({
            status: rs.status,
            pages: rs.pages,
            types: rs.types,
            base_url: rs.base_url
            });
    } catch (e) {
        res.json({ status: false, err: 'id not found!'});
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

    queue.process('convert_pdf', Config.CONCURRENT_JOB, (job, done) => {
        let worker = new ConvertPdfWorker(redis_storage, io);
        worker.process(job, done);
    });

    queue.process('convert_png', Config.CONCURRENT_JOB, (job, done) => {
        let worker = new ConvertPngWorker(redis_storage, io);
        worker.process(job, done);
    });

    queue.process('convert_jpg', Config.CONCURRENT_JOB, (job, done) => {
        let worker = new ConvertJpgWorker(redis_storage, io);
        worker.process(job, done);
    });
}

bootup();

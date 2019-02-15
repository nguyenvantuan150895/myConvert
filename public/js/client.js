
const url_post = 'http://localhost:3000/upload';
const server = 'http://localhost:3000';


$(function () {
    console.log("Ready!!!");
    $("input:file").change(async function () {
        // get element by id
        let doc = document.getElementById('doc').files[0];
        let element_pdf = $("#pdf");
        let element_png = $("#png");
        let element_svg = $("#svg");

        // upload
        let upload_service = new UploadService(doc, url_post);
        let meta_data = await upload_service.upload();
        console.log("META-DATA:", meta_data);

        // converting
        let converting_doc = new ConvertingDocument(meta_data);
        converting_doc.connect(server);

        // viewer
        let viewer = new Viewer(element_pdf, element_png, element_svg);
        viewer.switch(converting_doc);

        // show btn
        toggleBtn();
        $("#btn_send").click(() => {
            let page_num = $("#number").val();
            viewer.show(page_num);
        })
    });    
})

let toggleBtn = () => {
    $("#btn_send").show();
    $("#number").show();
}




















// const Viewer = require('./viewer.js');
// const UploadService = require('./upload');


// let upload_service = new UploadService(doc, url);
// let res = await upload_service.upload();
// let document_id = res.id;

// let converting_document = new ConvertingDocument(document_id);
// converting_document.connect(server_url);

// Viewer.switch(converting_document);
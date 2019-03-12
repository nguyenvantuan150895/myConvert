
const SERVER_ADD = 'http://localhost:3000';

$(function () {
    console.log("Ready!!!");
    // element upload
    let info_err = $("#info_err_upload");
    let info_data = $("#info_meta_data");
    // element view progress
    let pdf = $("#pdf");
    let png = $("#png");
    let svg = $("#svg");
    let jpg = $("#jpg");
    let view_img = $(".view_image");
    let show_pages = $("#show_total_page");
    let pagination = $("#pagination");
    let err_id = $("#err_id");

    // upload
    $("input:file").change(async function () {
        let doc = document.getElementById('doc').files[0];
        let url_upload = `${SERVER_ADD}/upload`;
        let upload_service = new UploadService(doc, url_upload);
        let meta_data = await upload_service.upload();
        console.log("META_DATA:", meta_data);

        let viewer_upload = new ViewerUpload(meta_data, info_err, info_data);
        viewer_upload.process();
    });

    // get progress convert
    $("#btn_submit").click(async function () {
        let doc_id = $("#doc_id").val(); doc_id = doc_id.trim();
        let get_service = new GetService(doc_id, SERVER_ADD);
        let meta_doc = await get_service.get();
        let total_page = undefined;
        if (meta_doc.status == 'converted') {
            // done
            console.log('meta_doc:', meta_doc);
            total_page = meta_doc.pages;
            let viewer_converted = new ViewerConverted(doc_id, total_page, pdf, png, svg, jpg, view_img,
                show_pages, pagination, err_id);
            viewer_converted.process(1);
        }
        else if (meta_doc.status == 'converting') {
            // create sub
            total_page = meta_doc.pages;
            let convert_service = new ConvertService(doc_id);
            convert_service.connect(SERVER_ADD);
            let viewer_converting = new ViewerConverting(total_page, pdf, png, svg, jpg, view_img,
                show_pages, pagination, err_id);
            viewer_converting.switch(convert_service);
        }
        else {
            // id not found
            show_pages.hide();
            pagination.empty();
            view_img.hide();
            err_id.show();
        }
    })
})














// converting
        // let process_convert = new ProcessConvert(doc_id);
        // process_convert.connect(SERVER_ADD, (total_page) => {
        //     // viewer
        //     let viewer_convert = new ViewerConvert(total_page, pdf, png, svg,
        //         jpg, view_img, show_pages, pagination, err_id);
        //     viewer_convert.switch(process_convert);
        // });
        // process_convert.connect(SERVER_ADD);

        // setTimeout(() => {
        //     let rs = process_convert.getTotalPage();
        //     console.log("rs:", rs);
        // }, 3000);
        // let viewer_convert = new ViewerConvert(pdf, png, svg,
        //     jpg, view_img, show_pages, pagination, err_id);
        // viewer_convert.switch(process_convert);
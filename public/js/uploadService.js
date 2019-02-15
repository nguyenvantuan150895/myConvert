
class UploadService {
    constructor(doc, url) {
        this.doc = doc;
        this.url = url;
    }

    upload() {
        let form = new FormData();
        form.append("doc", this.doc);

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url,
            "method": "POST",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "895baf06-885c-917a-b7b3-32006e8dd338"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (response) {
            response = JSON.parse(response);
            // console.log("RESPONSE-AJAX:", response);
            return response;
        });
    }
}

window.UploadService = UploadService;



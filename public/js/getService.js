class GetService {
    constructor(doc_id, url) {
        this.doc_id = doc_id;
        this.url = url;
    }

    get() {
        return new Promise((resolve, reject) => {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": `${this.url}/document/job/${this.doc_id}`,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "e959dd50-b2ea-78c3-6cb9-fcb26cf395fc"
                }
            }

            $.ajax(settings).done(function (response) {
                resolve(response);
            });
        })
    }
}

window.GetService = GetService;
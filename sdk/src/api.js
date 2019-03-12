class API {
	get(url) {
		return new Promise((resolve, reject) => {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache",
                }
            }

            $.ajax(settings).done(function (response) {
                resolve(response);
            });
        })
	}

	upload(url, form) {
		return new Promise((resolve, reject) => {
            let settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "POST",
                "headers": {
                    "cache-control": "no-cache",
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": form
            }

            $.ajax(settings)
                .done(function (response) {
                    response = JSON.parse(response);
                    resolve(response);
                })
                .fail(function (xhr, status, error) {
                    reject(error);
                });
        });
	}
};

module.exports = new API();
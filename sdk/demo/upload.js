const SERVER_ADD = 'http://10.10.0.148:3000';
(function () {
    window.upload = async function() {
    	let doc = document.getElementById('doc').files[0];
        let upload_job = new DocumentConvertingService.UploadJob(doc, SERVER_ADD);
        let res = await upload_job.upload();

        if(res.status == false) {
        	alert("Failed??????");
        	return;
        }

        window.document_file = res.document;
        await window.document_file.connect();

        window.document_file.onConvertProgress((converted, pages) => {
        	console.log(`Converted ${converted}/${pages}`);
        });

        window.current_page = 1;
        window.showPage(window.current_page);
    }

    window.back = function() {
    	window.showPage(--window.current_page);
    }

    window.next = function() {
    	window.showPage(++window.current_page);
    }

    window.showPage = function(page_num) {
    	document.getElementById("page_num").textContent = "Page:" + page_num;
        let viewer = document.getElementById("image_viewer");
        window.document_file.clearCallbacks();
        viewer.src = "https://loading.io/spinners/azure/lg.azure-round-loader.gif";
        window.document_file.page(page_num, (page) => {
            console.warn("Will show page:", page);
            viewer.src = page.based_url + page.types[0];
        });
    }
}());
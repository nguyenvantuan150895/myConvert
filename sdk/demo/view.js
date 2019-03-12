const SERVER_ADD = 'http://10.10.0.148:3000';
(function () {
    window.connect = async function() {
        window.document_file = new DocumentConvertingService.Document("6c730de0-35d0-11e9-a858-6b58bc71ac82", SERVER_ADD);
        await window.document_file.connect();
        console.log("Have pages:", document_file.pages);

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
            console.log(page);
            viewer.src = page.based_url + page.types[0];
        });
    }
}());
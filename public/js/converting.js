class ConvertingDocument {
    constructor(document_metadata) {
        this.document_metadata = document_metadata;
        this.listener = {};
        this.last_page = 0;
    }

    connect(url = "http://localhost:3000") {
        this.socket = io(url);
        // this.socket.on('progress', this.onProgress.bind(this));
        this.socket.on('progress', (last_event) => {
            // console.log("Last_event:", last_event);
            this.onProgress(last_event);
        });
        this.socket.emit('regis_document', this.document_metadata, (last_event) => {
            this.onProgress(last_event);
        });
    }
   
    buildMetadata(page_num) {
        let doc_id = this.document_metadata.doc_id;
        let path_pdf = `/document/${doc_id}/page_${page_num}.pdf`;
        let path_png = `/document/${doc_id}/page_${page_num}.png`;
        let path_svg = `/document/${doc_id}/page_${page_num}.svg`;
        return {
            path_pdf: path_pdf,
            path_png: path_png,
            path_svg: path_svg
        }
    }

    offPageListen() {
        this.listener = {};
    }

    onPageListener(page_num, callback) {
        if (this.last_page >= page_num) {
            let page_metadata = this.buildMetadata(page_num);
            callback(page_metadata);
        } else {
            this.listener[page_num] = this.listener[page_num] || []; // array
            this.listener[page_num].push(callback);
        }
    }

    //data: {type="converted", page_num, types}
    onProgress(last_page) {
        this.last_page = last_page;
        // let page_metadata = this.buildMetadata(page_num);
        Object.keys(this.listener).map((key) => {
            let page_metadata = this.buildMetadata(key);
            if(key <= last_page) {
                this.listener[key].map((callback) => {
                    callback(page_metadata);
                });
            }
        })
    }

}

window.ConvertingDocument = ConvertingDocument;
















 //data: {type="converted", page_num, types}
    // onProgress(data) {
    //     let page_metadata = this.buildMetadata(data.page_num);

    //     Object.keys(this.listener).map((page_num) => {
    //         if(page_num <= data.page_num) {
    //             this.listener[page_num].map((callback) => {
    //                 callback(page_metadata);
    //             });
    //         }
    //     })
    // }
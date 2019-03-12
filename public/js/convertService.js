class ConvertService {
    constructor(doc_id) {
        this.doc_id = doc_id;
        this.listener = {};
        this.last_page = 0;
    }

    connect(url = "http://localhost:3000") {
        this.socket = io(url);
        this.socket.on('progress', (last_event) => {
            this.onProgress(last_event);
        });
        this.socket.emit('regis_document', this.doc_id, (last_event) => {
            this.onProgress(last_event);
        });
    }
   
    buildMetadata(page_num) {
        let path_pdf = `/document/${this.doc_id}/page_${page_num}.pdf`;
        let path_png = `/document/${this.doc_id}/page_${page_num}.png`;
        let path_svg = `/document/${this.doc_id}/page_${page_num}.svg`;
        let path_jpg = `/document/${this.doc_id}/page_${page_num}.jpg`;
        return {
            path_pdf: path_pdf,
            path_png: path_png,
            path_svg: path_svg,
            path_jpg: path_jpg
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
            // this.listener[page_num] = this.listener[page_num] || []; // array
            // this.listener[page_num].push(callback);
            this.listener[page_num] = callback;
        }
    }

    //data: {page_done, types, total_page}
    onProgress(data) {
        console.log("DATA:", data);
        this.last_page = data.page_done;
        Object.keys(this.listener).map((key) => {
            console.log("sodem");
            let page_metadata = this.buildMetadata(key);
            if(key <= data.page_done) {
                this.listener[key](page_metadata);
                // this.listener[key].map((callback) => {
                //     callback(page_metadata);
                // });
                this.listener = {};
            }
        })
    }
}

window.ConvertService = ConvertService;

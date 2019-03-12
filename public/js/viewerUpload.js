class ViewerUpload {
    constructor(meta_data, info_err, info_data) {
        this.meta_data = meta_data;
        this.info_err = info_err;
        this.info_data = info_data;
    }

    process() {
        if (this.meta_data.status == false)
            this.uploadErr();
        else
            this.uploadFinish();
    }

    uploadErr() {
        this.info_data.hide();
        this.info_err.show();
    }

    uploadFinish() {
        this.info_err.hide();
        this.info_data.show();
        this.info_data.empty();
        Object.keys(this.meta_data).map((key) => {
            this.info_data.append(`<p><b>${key}:</b> ${this.meta_data[key]} </p> <br>`)
        })
    }
}

window.ViewerUpload = ViewerUpload;
class Viewer {
    constructor(element_pdf, element_png, element_svg) {
        this.pdf = element_pdf;
        this.png = element_png;
        this.svg = element_svg;
    }

    switch(converting_document) {
        this.document = converting_document;
        this.show(1);
    }

    show(page_num) {
        this.setImageLoading('/image/loading.gif');
        this.document.offPageListen();
        this.document.onPageListen(page_num, (data) => {
            this.setImagePageNum(data);
        });
    }

    setImageLoading(path_image) {
        this.pdf.attr('src', path_image);
        this.png.attr('src', path_image);
        this.svg.attr('src', path_image);
    }

    setImagePageNum(page_metadata) {
        this.pdf.attr('src', page_metadata.path_pdf);
        this.png.attr('src', page_metadata.path_png);
        this.svg.attr('src', page_metadata.path_svg);
    }
}

window.Viewer = Viewer;

class ViewerConverting {
    constructor(total_page, pdf, png, svg, jpg, view_img, show_pages, pagination, err_id) {
        this.total_page = total_page;
        this.pdf = pdf;
        this.png = png;
        this.svg = svg;
        this.jpg = jpg;
        this.view_img = view_img;
        this.show_pages = show_pages;
        this.pagination = pagination;
        this.err_id = err_id;
    }

    switch(converting_document) {
        this.document = converting_document;
        if(this.total_page == 1) 
            this.show(1);
        this.err_id.hide();
        this.paging();
    }

    show(page_num) {
        this.setImageLoading('/image/loading2.jpg');
        // this.document.offPageListen();
        console.log("page_num:", page_num);
        this.document.onPageListener(page_num, (data) => {
            this.setImagePageNum(data);
        });
    }

    paging() {
        this.show_pages.text(`Total page: ${this.total_page}`).show();
        this.view_img.show();
        this.pagination.twbsPagination({
            totalPages: this.total_page,
            visiblePages: 5,
            next: 'Next',
            prev: 'Prev',
            onPageClick: (event, page) => {
                this.show(page);
            }
        });
    }

    setImageLoading(path_image) {
        this.pdf.attr('src', path_image);
        this.png.attr('src', path_image);
        this.svg.attr('src', path_image);
        this.jpg.attr('src', path_image);
    }

    setImagePageNum(page_metadata) {
        this.pdf.attr('src', page_metadata.path_pdf);
        this.png.attr('src', page_metadata.path_png);
        this.svg.attr('src', page_metadata.path_svg);
        this.jpg.attr('src', page_metadata.path_jpg);
    }
}

window.ViewerConverting = ViewerConverting;
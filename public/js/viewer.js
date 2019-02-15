
class Viewer {
    constructor(element_pdf, element_png, element_svg, element_jpg, total_page) {
        this.pdf = element_pdf;
        this.png = element_png;
        this.svg = element_svg;
        this.jpg = element_jpg;
        this.total_page = total_page;
    }

    switch(converting_document) {
        this.document = converting_document;
        this.show(1);
        this.paging();
    }

    show(page_num) {
        this.setImageLoading('/image/loading2.jpg');
        this.document.offPageListen();
        this.document.onPageListener(page_num, (data) => {
            this.setImagePageNum(data);
        });
    }

    paging() {
        $("#total_page").text(`Total page: ${this.total_page}`).show();
        $(".view").show();
        $('#pagination-demo').twbsPagination({
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
        console.log("SET-IMAGE");
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

window.Viewer = Viewer;
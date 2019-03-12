
class ViewerConverted {
    constructor(doc_id, total_page, pdf, png, svg, jpg, view_img, show_pages, pagination, err_id) {
        this.doc_id = doc_id;
        this.total_page = total_page;
        this.pdf = pdf;
        this.png = png;
        this.svg = svg;
        this.jpg = jpg;
        this.view_img = view_img;
        this.show_pages = show_pages;
        this.pagination = pagination;
        this.err_id = err_id;
        this.paging();
    }

    process(page_num) {
        let meta_data = this.buildMetadata(page_num);
        this.show(meta_data);
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

    show(data) {
        this.setImagePageNum(data);
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
                this.process(page);
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

    handleIdNotFound() {
        this.show_pages.hide();
        this.pagination.empty();
        this.view_img.hide();
        this.err_id.show();
    }
}

window.ViewerConverted = ViewerConverted;
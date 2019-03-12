const io = require('./libs/socket.io');

class ConvertingDocument {
	constructor(doc_id, serivce_url) {
		this.doc_id = doc_id;
		this.serivce_url = serivce_url;

		this.socket = io(`${serivce_url}`, {path: "/document/socket.io"});
		this.socket.on('progress', this._onProgress.bind(this));
        this.socket.emit('regis_document', this.doc_id, this._onProgress.bind(this));
        this.listener = {};

        this._types = null;
        this._page_done = 0;
        this._types_pages = {};
	}

	clearCallbacks() {
		this.listener = {};
	}

	onPageFinished(pageNum, callback) {
		if(this._page_done < pageNum) {
			this.listener[pageNum] = this.listener[pageNum] || [];
			this.listener[pageNum].push(callback);
		} else {
			callback(this._types_pages[pageNum] || this._types);
		}
	}

	onUpdateProgress(callback) {
		this.progress_callback = callback;
	}

	/**
	Private functions
	*/

	_onProgress(last_event) {
		if(this.progress_callback != null)
			this.progress_callback(last_event.page_done, last_event.total_page);

		if(!this._types)
			this._types = last_event.types;
		this._page_done = last_event.page_done;
		this._types_pages[last_event.page_done] = last_event.types;
		Object.keys(this.listener).map((pageNum) => {
			if(pageNum <= last_event.page_done) {
				this.listener[pageNum].map((callback) => {
					callback(last_event.types);
				});
				this.listener[pageNum] = [];
			}
		});
	}
}

module.exports = ConvertingDocument;
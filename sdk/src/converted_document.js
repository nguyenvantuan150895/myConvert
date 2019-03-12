class ConvertedDocument {
	constructor(doc_id, service_url, pages) {
		this._pages = pages;

	}

	clearCallbacks() {

	}

	onUpdateProgress(callback) {
		callback(this._pages, this._pages);
	}

	onProgress() {

	}

	onPageFinished(pageNum, callback) {
		callback();
	}
}

module.exports = ConvertedDocument;
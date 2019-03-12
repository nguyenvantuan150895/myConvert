const API = require('./api')
const ConvertingDocument = require('./converting_document');
const ConvertedDocument = require('./converted_document');

const DocumentStatus = {
	NOT_FOUND: 0,
	CONVERTING: 1,
	CONVERTED: 2
}

class Document {
	constructor(doc_id, service_url) {
		this.doc_id = doc_id;
		this.service_url = service_url;
		this._status = DocumentStatus.NOT_FOUND;
	}

	async connect() {
		let res = await API.get(`${this.service_url}/document/${this.doc_id}/meta.docs`);
		let res_json = JSON.parse(res);
		console.log(res_json);
		//save metadata 
		this._origin = res_json.origin;
		this._base_url = res_json.base_url;
		this._pages = res_json.pages;
		this._types = res_json.types;
		switch(res_json.status) {
			case "converting": 
				this._status = DocumentStatus.CONVERTING;
				this._doc_logic = new ConvertingDocument(this.doc_id, this.service_url);
				break;
			case "converted": 
				this._status = DocumentStatus.CONVERTED;
				this._doc_logic = new ConvertedDocument(this.doc_id, this.service_url, this._pages);
				break;
			default: 
				this._status = DocumentStatus.NOT_FOUND;
				break;
		}
	}

	get pages() {
		return this._pages;
	}

	get status() {
		return this._status;
	}

	onConvertProgress(callback) {
		this._doc_logic.onUpdateProgress(callback);
	}

	clearCallbacks() {
		this._doc_logic.clearCallbacks();
	}

	page(page_num, callback) {
		if(page_num <= 0 || page_num > this._pages)
			return callback(null);
		this._doc_logic.onPageFinished(page_num, (types) => {
			callback({
				types: types || this._types,
				based_url: `${this.service_url}${this._base_url}/page_${page_num}.`
			});
		});
	}
}

Document.prototype.DocumentStatus = DocumentStatus;
module.exports = Document;
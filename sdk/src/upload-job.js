const API = require('./api')
const Document = require('./document');

class UploadJob {
	constructor(doc, service_url) {
		this.doc = doc;
		this.service_url = service_url;
	}

	async upload() {
		console.log("Will upload to", this.doc, this.service_url);
		let form = new FormData();
        form.append("doc", this.doc);
		let res = await API.upload(`${this.service_url}/upload`, form);
		console.log(res);

		if(res.status != false) {
			return {
				status: true,
				document: new Document(res.doc_id, this.service_url)
			}
		} else {
			return {
				status: false
			}
		}
	}
}

module.exports = UploadJob;
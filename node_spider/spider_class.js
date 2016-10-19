// url管理器


class UrlHandler {

	constructor(){
		this.new_url_list = [];
		this.new_url = new Set();
		this.old_url = new Set();
	}

	// 判断是否还有新 url
	hasNewUrl (){
		return this.new_url.size;
	}

	// 获取一个url
	getNewUrl (){
		var _self = this,
			new_url = new_url_list.pop();

		this.old_url.add(new_url);
		this.new_url.delete(new_url);
		return new_url;
	}

	// 添加一个
	addNewUrl (pathName){
		if(this.new_url.has(pathName) || this.old_url.has(pathName)){
			return '';
		}
		this.new_url_list.push(pathName);
		this.new_url.add(pathName);
	}

	// 批量添加
	addNewUrls (pathNames){
		if(!pathNames || !pathNames.length){
			return '';
		}
		for(var pathName in pathNames){
			this.addNewUrl(pathName);
		}
	}


}


module.exports = UrlHandler;




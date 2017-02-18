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
		var new_url = this.new_url_list.shift();

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
		for(var i in pathNames){
			this.addNewUrl(pathNames[i]);
		}
	}

	// 批量获取
	getNewUrls (iNum){
		var arr = [];
		if(this.hasNewUrl() > iNum){
			for(let i = 0; i< iNum; i++){
				arr.push(this.getNewUrl())
			}
		}
		return arr;
	}


}


module.exports = UrlHandler;




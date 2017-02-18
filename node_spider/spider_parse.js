// html解析器

var cheerio = require("cheerio");

// 返回 {"data":{},"new_url":[]}

class ParseHandler {

	constructor(){
		this.$ = null;
		// this.reg = /\/people\//;
	}

	parseHtml(html_dom, currentUrl){

		this.$ = cheerio.load(html_dom);
		var aNewUrls = this.__parseNewUrls();
		var oNewUser = this.__parseNewUser(currentUrl);

		return {'userData': oNewUser, 'newUrls': aNewUrls};
	}

	// 解析 新的url
	__parseNewUrls (){
		var aNewUrl = new Set();
		Array.from(this.$('.author-link')).forEach(function(value, index){
			var sUrl = this.$(value).attr('href');
			aNewUrl.add(sUrl);
		}.bind(this));
		return aNewUrl;
	}

	// 提取页面内的有效用户信息
	__parseNewUser (currentUrl){
		var obj = {};
		obj.name = this.$(".ProfileHeader-name").text();
		obj.description = this.$(".ProfileHeader-headline").text();
		obj.jobs = this.$(".ProfileHeader-info").text();

		// 可追溯更多用户
		// obj.follow = this.$("href*=[following]").text();
		// obj.beFollow = this.$();
		console.log(obj.name);
		// 1: 男, 2: 女
		if(this.$(".Icon--male").length){
			obj.sex = '1';	
		}else{
			obj.sex = '2';
		}

		return obj;
	}



}


module.exports = ParseHandler;

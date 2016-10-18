// html下载器

var url = require("url"),
	http = require("http"),
	https = require("https");

class LoadingHandler {

	constructor(){
		this.url_reg = /^https/;		
	}

	// 下载 html代码
	loadingHtml (newUrl){
		var oUrl = url.parse(newUrl),
		b = this.url_reg.test(oUrl.protocol);
		return (b ? this.__httpsLoading(newUrl) : this.__httpLoading(newUrl));
	}




	// 私有函数
	// http
	__httpLoading(url){
		return new Promise(function(resolve, reject){
			http.get(url, function(res){
				var html = '';
				res.on("data", function(chunk){
					html += chunk;
				});
				res.on("end", function(){
					resolve(html);
				});
			}).on("error", function(err){
				reject(err);
			});
		});
	}
	// https
	__httpsLoading(url){
		return new Promise(function(resolve, reject){
			https.get(url, function(res){
				var html = '';
				res.on("data", function(chunk){
					html += chunk;
				});
				res.on("end", function(){
					resolve(html);
				});
			}).on("error", function(err){
				reject(err);
			});
		});
	}


}


module.exports = LoadingHandler;




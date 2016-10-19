// html解析器

var cheerio = require("cheerio");

// 返回 {"data":{},"new_url":[]}

class ParseHandler {

	constructor(){
		// pass
	}

	parseHtml(html_dom){

		// 需要多 dom树 细节化处理 

		var $ = cheerio.load(html_dom);
		var aA = $("a");
		console.log(aA.length);

		return {"data":{}, "new_url":[]};
	}


}


module.exports = ParseHandler;

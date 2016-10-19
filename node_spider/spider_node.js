

var ClassUrl = require("./spider_class"),
	ClassLoadingHandler = require("./spider_loading"),
	ClassParse = require("./spider_parse"),
	ClassOutputer = require("./spider_outputer");


oUrlObj = new ClassUrl();
oLoadingObj = new ClassLoadingHandler();
oParse = new ClassParse();
oOutputer = new ClassOutputer("aa.txt");

var promise = oLoadingObj.loadingHtml("https://www.baidu.com");



// 测试 代码
promise.then(function(data){

	let oResult = oParse.parseHtml(data);
	if(!!oResult['data']){
		oResult = {
			"data": {"a":"1","b":"2","c":'3'}
		}
	}
	console.log(oResult);
	oOutputer.setData_list(oResult.data);
	oOutputer.outerData();


}, function(error){
	console.log(error);
});



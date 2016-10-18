

var ClassUrl = require("./spider_class"),
	ClassLoadingHandler = require("./spider_loading");


oUrlObj = new ClassUrl();
oLoadingObj = new ClassLoadingHandler();

var promise = oLoadingObj.loadingHtml("https://www.baidu.com");

promise.then(function(data){

	console.log(data);

}, function(error){
	console.log(error);
});



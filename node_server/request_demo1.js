

var http = require("http");
var https = require("https");

var url = "http://www.dsjlkj.com/";
var url2 = "http://wx301fd77388435637.zb.wifisong.com/shakemoney/?ticket=8da59745b5752fea5b47e859d2a8b8cd&activityid=2853820";

var url3 = "http://wx301fd77388435637.zb.wifisong.com/";
// var url4 = "https://yaoqianhu.xianlaohu.com/tiger/adv?debug=1";

var arr = [];

function fnA(){
	return new Promise(function(resolve, reject){
		http.get(url, function(res){
			// console.log("start");
			let html = '';
			res.on("data", function(chunk){
				html += chunk;
			});
			res.on("end", function(){
				console.log(html);
				resolve('succ')
			});
		}).on("error", function(err){
			// console.log("发生了错误", err);
			reject(err);
		});
	});
	
}


for(var i=0; i<1000; i++){
	arr.push(fnA());
}

Promise.all(arr).then(function(items){
	console.log(items);
}, function(err){
	console.log(err);
}).catch(function(err){
	console.log("捕获", err);
});






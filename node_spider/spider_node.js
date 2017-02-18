// nodeJs spider
// 最多 100Promise.

var path = require('path');

const MAIN_URL = "https://www.zhihu.com/topic/19550228/top-answers";
const THREADS = 100;
const HOST_NAME = 'https://www.zhihu.com';

// 精华问题－页码
var page = 1;
var page_max = 50;
var count = 0;

var aThreadMain = [];


var ClassUrl = require("./spider_class"),
	ClassLoadingHandler = require("./spider_loading"),
	ClassParse = require("./spider_parse"),
	ClassOutputer = require("./spider_outputer");


oUrlObj = new ClassUrl();
oLoadingObj = new ClassLoadingHandler();
oParse = new ClassParse();
oOutputer = new ClassOutputer("aa.txt");

for(let i=2; i<=page_max; i++){
	oUrlObj.addNewUrl(`/topic/19550228/top-answers?page=${i}`);
}


// 主函数
function main(url = MAIN_URL, index){
	
	let promise = oLoadingObj.loadingHtml(url);
	promise.then(function(data){

		count++;
		console.log(`第${count}个: ${url}`);

		let oResult = oParse.parseHtml(data);

		process.nextTick(function(){
			oUrlObj.addNewUrls(Array.from(oResult.newUrls));
			oOutputer.setData_list(oResult.userData);

			if(oUrlObj.hasNewUrl() > 0){
				let sNewUrl = oUrlObj.getNewUrl();
				console.log(oUrlObj.hasNewUrl());
				process.nextTick(function(){
					main(`${HOST_NAME}${sNewUrl}`, index);
				});
			}else{
				delete aThreadMain[index];
				for(let i = 0; i<aThreadMain.length; i++){
					if(aThreadMain[i]){
						return ;
					}
				}
				console.log(oUrlObj.hasNewUrl(), '结束!');
				oOutputer.outerData();
			};
		});
		
	}, function(error){
		console.log(error);
	});
}

for(let i=0; i<10; i++){
	let obj = {
		'index': i,
		'main': main
	}
	aThreadMain.push(obj);
}

aThreadMain[0].main(undefined, 0);

// setTimeout(function(){
// 	for(let i=1; i<aThreadMain.length; i++){
// 		aThreadMain[i].main(undefined, aThreadMain[i]['index']);
// 	}
// }, 4000);



/*
	估计可以试试的多异步请求方案: 目前只能单请求
	多个异步请求一起跑,将结果放入存储列队内，
	如果监测不出新Url了,将当前对象设置running为false,
	对存储列队内的数据进行处理,
	分析出新Url,重启为false的对象,或者可以将停止的放到一个序列内
	直到,所有任务对象不再运行,且没有数据可供解析
	输出最后结果
	结束
 */




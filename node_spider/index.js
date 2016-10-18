
// promise test

// console.log(process.argv);
// console.log(process.env);
// console.log(process.execArgv);

// console.log(os);

var i = 0, times = 1000;

function fnB(){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			if(i<10){
				i++;
				resolve(i);
			}else{
				reject(i);
			}
			
		}, times+=1000);
	});
}

var arr = [];
for(let i=0;i<10;i++){
	let a = fnB();
	arr.push(a);
}

Promise.all(arr).then(function(oP){
	console.log(oP);
});

function fnA(){

	// 不能实现 自动化生成对象 再次连缀使用

	var a = fnB();

	a.then(function(data){
		console.log(data);
		a = fnB();
	}, function(err){
		console.log(err);
		console.info("end");
	}).then(function(data){
		console.log(data);
	});

}


// fnA();



/***

	Promise 并不能直接实现 自动返回新对象连缀
	但是Promise可以将多个Promise对象结合成一个数组
	将此数组 全部到位后处理 then,接受所有promise实例对象 resolve返回的数值，
	then中第一个函数，如上，第二个函数返回 reject中可以返回的失败列表信息
	.

**/




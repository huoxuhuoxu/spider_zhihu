
// 数据输出器

var fs = require("fs");

class OutputerHandler{

	constructor (word_name){
		this.word_name = word_name;
		this.data_list = [];
	}

	setData_list (data){
		if(!data.name){return;}
		this.data_list.push(data);
	}

	getData_list (){
		return this.data_list.length;
	}

	outerData (){
		let str = this.__generatorDataToStr();
		fs.writeFile(this.word_name, str,function(err){
			if(err){
				console.error(err);
				process.exit(0);
			}
			console.log("完成");
		});
	}

	// 私有函数
	__generatorDataToStr(){
		if(!this.data_list.length){
			return '';
		}
		let str = '';
		for(let i in this.data_list){
			let item = this.data_list[i];
			str += (JSON.stringify(item) + "\n");
		}
		return str;
	}

}



module.exports = OutputerHandler;



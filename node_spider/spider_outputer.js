
var fs = require("fs");

class OutputerHandler{

	constructor (word_name){
		this.word_name = word_name;
		this.data_list = [];
	}

	setData_list (data){
		this.data_list.push(data);
	}

	getData_list (){
		return this.data_list.length;
	}

	outerData (){
		let str = null, _self = this;
		str = this.__generatorDataToStr();
		fs.writeFile(_self.word_name, str,function(err){
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



var EventEmitter = require('events');
var fetch = require('node-fetch');
class MyEmitter extends EventEmitter {}
class Manager_Liky{
	constructor() {
		this.events=new MyEmitter();
	}

	async get_nick_name_sycle(id){
		try{
	 		const response = await fetch(`https://pay.like.video/live/pay/App_entrance/likeidInfoH5?likeid=${id}`);
			const data = await response.json()
			if(data.userinfo.nick_name){return {result:data.userinfo.nick_name,err:false}}
			return {result:false,err:true}
		}catch(err){
			return {result:false,err:true}
		}
	}

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}



module.exports= new Manager_Liky
// /nick_name/api/pupgy/gzBHGMbbJC4J

//693597779
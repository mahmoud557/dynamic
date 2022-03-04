var EventEmitter = require('events');
var express = require('express')
var cors = require('cors')
var path = require('path')
var bodyParser = require('body-parser');
class MyEmitter extends EventEmitter {}

class API{
	constructor() {
		this.events=new MyEmitter();
		this.start()
	}


	async start(){
		console.log('loading')
		await this.load_managers()
		this.http_server = express()
		this.http_server.use(cors())
		this.http_server.use(bodyParser.json())	
		this.http_server.get('/pay/api/freefire/:id/:code',async(req,res)=>{
			var id=req.params.id;
			var code=req.params.code;
			var nick_name_result_object=await this.manager_browser.manager_freefire.pay_sycle(id,code)
			res.json(nick_name_result_object)
		})
		this.http_server.listen(3002)
		console.log('working')
	}

	async load_managers(){
		//this.manager_db = require('./manager_db.js');
		//this.manager_free_fire_codes =new (require('./manager_freefire_codes.js'))(this)
		this.manager_browser = require('./manager_browser.js');
		await this.manager_browser.ready()
	}	

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}


global.api=new API

// /nick_name/api/likee/693597779
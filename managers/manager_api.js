var EventEmitter = require('events');
var express = require('express')
var cors = require('cors')
var path = require('path')
var fetch = require('node-fetch');
var bodyParser = require('body-parser');
const FormData = require('form-data');
var {Headers} = require('node-fetch');
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
		this.http_server.get('/pay/api/freefire/:id/:code/:order_number/:code_id',async(req,res)=>{
			var id=req.params.id;
			var code=req.params.code;
			var order_number=+req.params.order_number;
			var code_id=+req.params.code_id;
			res.json({reseve_state:true})
			console.log(1)
			var result_object=await this.manager_browser.manager_freefire.pay_sycle(id,code)
			result_object.order_number=order_number;
			result_object.code_id=code_id;
			await this.send_free_fire_pay_result_to_back_end_point(result_object)
		})
		this.http_server.listen(3003)
		console.log('working')
	}

	async send_free_fire_pay_result_to_back_end_point(result_object){
		const meta = [['Content-Type', 'application/json']];
		const headers = new Headers(meta);	
 		const response = await fetch(
	 			`https://sw-games.net/api/req`,{
				method: 'POST',		
				headers:headers,       
				body: JSON.stringify(result_object)
			}
		);
		console.log(2)
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
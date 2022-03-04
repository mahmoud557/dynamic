var fetch = require('node-fetch');
var {Headers} = require('node-fetch');
var fs = require('fs');
const FormData = require('form-data');
var {parse} = require('node-html-parser');
function delay(time){
	return new Promise((res,rej)=>{
		setTimeout(()=>{res()},time)
	})
}

async function get_anwer_recerjen(id,key){
	await delay(2000)
	var answer = await fetch(
			`https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`,{
			method: 'POST',  
		}
	);
	answer= await answer.text()
	if(answer.status==1){
		return {state:'solved',ansewr:answer.request}
	}else{
		switch(answer.request){
			case 'CAPCHA_NOT_READY':
				this.get_anwer_recerjen(id,key)
				break
			case 'ERROR_CAPTCHA_UNSOLVABLE':
			case 'ERROR_BAD_DUPLICATES':
				return {state:'unsolved',action:'re_post'}
				break	
			default:
			    return {state:'unsolved',action:'stop'}							
		}
	}
}

(async()=>{
		/*var streeng="data:image/png;base64,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";	
		const form = new FormData();
		form.append('key', '4628c8a5502d2ce831730b7e044beef8');
		form.append('body', streeng);	
		form.append('method', 'base64');*/
		var bayment_object={
		    "cartTotal": "250",
		    "currency": "EGP",
		    "customer": {
		        "first_name": "mohammad",
		        "last_name": "hamza",
		        "email": "ma7moudxyz@gmail.com",
		        "phone": "0106075394",
		        "address": "test address"
		    },
		    "redirectionUrls": {
		         "successUrl" : "https://dev.fawaterk.com/success",
		         "failUrl": "https://dev.fawaterk.com/fail",
		         "pendingUrl": "https://dev.fawaterk.com/pending"   
		    },
		    "cartItems": [
		        {
		            "name": "Graficy plane",
		            "price": "250",
		            "quantity": "1"
		        }
		    ]
		}
		const meta = [['Content-Type', 'application/json'], ['Authorization', 'Bearer 108b43ac430d080a6faabbb987f2054b4033c04fa202159cfc']];
		const headers = new Headers(meta);		
 		const response = await fetch(
	 			`http://fawaterkstage.com/api/v2/createInvoiceLink`,{
				method: 'POST',  
				headers:headers,			       
				body: JSON.stringify(bayment_object)
			}
		);
		const data = await response.json()
		console.log(data)
		/*for(var link of root.querySelectorAll('a.bordered')){
			data_object.colores.push(link['original-title'])
		}*/

    	
})()



//https://shop2game.com/app/
//808306716
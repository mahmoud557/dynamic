var EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
class Maager_pupgy{
	constructor(props) {
		this.syciles_qu={}
		this.in_get_recerjen=false;
		this.last_sycile_id=0;
		this.events=new MyEmitter();
		this.start()
	}

	async start(){
		//this.handel_requstes()
		this.handel_sycile_end()
	}

	get_nick_name_sycle(id,reserver){
		return new Promise((res,rej)=>{
			this.last_sycile_id++
			this.syciles_qu[`${this.last_sycile_id}`]={res:res,id:id,reserver:reserver}
			if(!this.in_get_recerjen){
				this.events.emit('sycil_end')
			}
		})
	}

	get_firest_key_of_syciles_qu(){
		var keys=Object.keys(this.syciles_qu)
		if(keys.length>0){return keys[0]}else{return false}
	}

	handel_sycile_end(){
		this.events.on('sycil_end',async()=>{
			var firest_sycile_key=this.get_firest_key_of_syciles_qu();
			if(firest_sycile_key){
				this.in_get_recerjen=true;
				var sycile_object=this.syciles_qu[firest_sycile_key];
				var neck_name=await this.get_sycile(sycile_object['id'],sycile_object['reserver'])
				sycile_object['res'](neck_name)
				delete this.syciles_qu[firest_sycile_key]
				this.events.emit('sycil_end')
			}else{
				this.in_get_recerjen=false;
			}
		})
	}

	async get_sycile(id,reserver){
		try{
			await this.fill_player_id(id,reserver)	
			await this.click_ok_bt(reserver)	
			var neck_name=await this.get_nickname(reserver)
			await this.click_ok_edit(reserver)
			await this.delete_previos_id(id,reserver)
			if(!neck_name){return {result:false,err:true}}
			return {result:neck_name,err:false}
		}catch(err){
			console.log(err)
			return {result:false,err:true}
		}
	}

	click_on_player_id_interval(reserver){
		this.reserver=reserver;
		setInterval(async()=>{
			if(!this.in_get_recerjen){
				try{
					await this.reserver.waitForSelector(`[placeholder='Please enter Player ID']`,{timeout:4000});
					var national_id_input=await this.reserver.$(`[placeholder='Please enter Player ID']`,{timeout:4000})
					await national_id_input.click()				
				}catch(err){console.log(err)}
			}
		},10000)
	}

	async fill_player_id(id,reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector(`[placeholder='Please enter Player ID']`,{timeout:4000});
				var national_id_input=await reserver.$(`[placeholder='Please enter Player ID']`,{timeout:4000})
				await national_id_input.click()
				await reserver.keyboard.type(id,{delay:200});
				res(true)
			}catch(err){
				console.log(err)
				res(false)
			}			
		})
	}

	async hid_pop_up(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForXPath('/html/body/div[2]/div/div',{timeout:4000})
				var clouse_bt=await reserver.$x(`/html/body/div[2]/div/div`)
				await clouse_bt[0].click()
				res(true)
			}catch(err){
				console.log(err)
				res(false)
			}				
		})
	}

	async click_ok_bt(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForXPath('/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[2]',{timeout:4000})
				var ok_bt=await reserver.$x(`/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[2]`)
				await ok_bt[0].click()
				res(true)
			}catch(err){
				console.log(err)
				res(false)
			}				

		})
	}

	async click_ok_edit(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForXPath('/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[2]/a',{timeout:4000})
				var edit_bt=await reserver.$x(`/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[2]/a`)
				await edit_bt[0].click()
				res(true)				
			}catch(err){
				console.log(err)
				res(false)
			}

		})
	}

	async delete_previos_id(id,reserver){
		return new Promise(async(res,rej)=>{
			await reserver.waitForSelector(`[placeholder='Please enter Player ID']`);
			var national_id_input=await reserver.$(`[placeholder='Please enter Player ID']`)
			await national_id_input.click()
			for(var i=0;i<id.length;i++){
				await reserver.keyboard.press('Backspace');
			}
			res(true)
		})
	}	

	async get_nickname(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForXPath('/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[1]/div[1]/p',{timeout:4000})
				var nikname_element=await reserver.$x(`/html/body/div[1]/div/div[3]/div[1]/div[3]/div/div/div/div[1]/div[1]/p`)
				var nikname=await nikname_element[0].evaluate((node) => node.innerText)
				res(nikname)
			}catch(err){
				console.log(err)
				res(false)
			}
		})
	}		

    delay(time){
        return new Promise((res,rej)=>{
            setTimeout(()=>{res()},time)
        })
    }

}

//gzBHGMbbJC4J

//51338094177
//5421181721
//5427697474

//1221951090

module.exports= new Maager_pupgy




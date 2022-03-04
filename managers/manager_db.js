var LinvoDB = require("linvodb3");
LinvoDB.defaults.store = { db: require("leveldown") };
LinvoDB.dbPath = process.cwd();

class Manager_Db{

	constructor(props) {
		this.db={}
		this.db.free_fire_codes= new LinvoDB("free_fire_codes", { /* schema, can be empty */ })
		this.start()
	}

	add_new_user(user_object){
		return new Promise((res,rej)=>{
			this.db.users.save(user_object,async(err,docs)=>{
				console.log(docs)
				if(err){res({err:true,result:false})}
				res({err:false,result:true})
	        })			
		})		
	}

	async start(){
		//this.load_componants()
	}	


    delay(time){
        return new Promise((res,rej)=>{
            setTimeout(()=>{res()},time)
        })
    }

}

module.exports= new Manager_Db
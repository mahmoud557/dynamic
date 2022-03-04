class Manager_Free_Fire_Codes{

	constructor(father) {
		this.father=father;
		this.start()
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

module.exports=  Manager_Free_Fire_Codes
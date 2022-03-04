var fetch = require('node-fetch');
var fs = require('fs');
var {parse} = require('node-html-parser');
function delay(time){
	return new Promise((res,rej)=>{
		setTimeout(()=>{res()},time)
	})
}

(async()=>{
 		var response = await fetch(
	 			'https://www.modanisa.com/ar/api/product_variants.php?productId=1885230&productSef=caramel-multi-crew-neck-unlined-dress-ceylan-otantik-1885230-r&beden='
		);
		var data = await response.text()
		var root = parse(data);

		var data_object={
			sizies:[],
			colores:[],
			price:''
		}

		for(var childNode of root.querySelector('#size-box-container').childNodes[0].childNodes[0].childNodes.splice(1)){
			data_object.sizies.push(childNode.text)
		}

 		var response = await fetch(
	 			'https://www.modanisa.com/ar/caramel-multi-crew-neck-unlined-dress-ceylan-otantik-1885230-r.html'
		);
		var data = await response.text()
		var root = parse(data);
		//console.log(root.querySelector('#other-color-products-container')['_rawAttrs'])
		data_object.price=root.querySelector('.productPriceInfo-mainPrice').removeWhitespace().text;
		console.log(data_object)

		/*for(var link of root.querySelectorAll('a.bordered')){
			data_object.colores.push(link['original-title'])
		}*/

		

})()

//https://shop2game.com/app/
//808306716
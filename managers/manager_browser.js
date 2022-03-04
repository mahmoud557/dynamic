var EventEmitter = require('events');
var path = require('path')
const puppeteer = require('puppeteer-extra');
var clous_firest_blank_page_state=false;
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//puppeteer.use(StealthPlugin())
puppeteer.use(
  RecaptchaPlugin({
	    provider: {
	      id: '2captcha',
	      token: '4628c8a5502d2ce831730b7e044beef8' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
	    },
    	visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  	})
)

class MyEmitter extends EventEmitter {}

class Manager_Browser{
	constructor() {
		this.events=new MyEmitter();
		this.browser;
		this.reserver_tabs={};
		this.re_open_browser_count=0;
		this.start()
	}


	ready(){
		return new Promise((res,rej)=>{
			if(this.ready_state==true){
				res(true)
			}else{
				this.events.once('ready',()=>{
					res(true)
				})
			}
		})
	}

	async start(){
		await this.open_browser(false)
		await this.open_reserver_taps(['1','2'])
		await this.load_managers()
	}
	async load_managers(){
		this.manager_freefire = require('./manager_freefire.js');
		this.manager_freefire.set_reserver(this.reserver_tabs['1'],'1')
		this.manager_freefire.set_reserver(this.reserver_tabs['2'],'2')
		this.events.emit('ready')
	}

	async open_browser(visible_stat,prev_res){
		if(!prev_res){
			return new Promise(async(res,rej)=>{
				var extension_path='C:\\Users\\10\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\mpbjkejclgfgadiemmefgebjfooflfhl\\1.3.1_0'
				try{
					this.browser=await puppeteer.launch({
						headless: !visible_stat,
					    slowMo:50,
					    defaultViewport: null,
					    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
					    ignoreDefaultArgs: ["--disable-extensions"],
					    ignoreHTTPSErrors: true,
					    args: ['--disable-web-security','--disable-raf-throttling', '--disable-background-timer-throttling', '--disable-renderer-backgrounding','--allow-file-access-from-files','--enable-features=NetworkService','--no-sandbox','--window-size=1366,768',`--load-extension=${extension_path}`, `--disable-extensions-except=${extension_path}`]
					})
					this.visible_stat=visible_stat;
					this.open_state=true;
					this.context = this.browser.defaultBrowserContext();
					this.context.clearPermissionOverrides();
					res(true);			
				}catch(err){
					if(this.re_open_browser_count<5){
						this.re_open_browser_count++
						await this.open_browser(visible_stat,res)
					}else{
						res(false);	
					}
				}			
			})			
		}else{
			try{
				this.browser=await puppeteer.launch({
					headless: !visible_stat,
				    slowMo:50,
				    defaultViewport: null,
				    ignoreDefaultArgs: ["--disable-extensions"],
				    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
				    ignoreHTTPSErrors: true,
 					args: ['--disable-web-security','--disable-raf-throttling', '--disable-background-timer-throttling', '--disable-renderer-backgrounding','--allow-file-access-from-files','--enable-features=NetworkService','--no-sandbox','--window-size=1366,768',`--load-extension=${extension_path}`, `--disable-extensions-except=${extension_path}`]
				})
				this.visible_stat=visible_stat;
				this.context = this.browser.defaultBrowserContext();
				this.context.clearPermissionOverrides();				
				prev_res(true);			
			}catch(err){
				console.log(err)
				if(this.re_open_browser_count<5){
					this.re_open_browser_count++
					await this.open_browser(visible_stat,prev_res)
				}else{
					prev_res(false);	
				}
			}				
		}
	}

 	open_ruteen(tab){
 		return new Promise(async(res,rej)=>{
			//await this.page.setUserAgent(this.userAgent);
		    await tab.evaluateOnNewDocument(() => {
		      Object.defineProperty(navigator, 'webdriver', {
		        get: () => false,
		      });
		    });
		    await tab.evaluateOnNewDocument(() => {
		      Object.defineProperty(navigator, 'plugins', {
		        get: () => [1, 2, 3, 4, 5],
		      });
		    });	    
		    res()
 		})
 	}	

	async open_reserver_taps(tabs_ides_array){
		for(var tab_id of tabs_ides_array){
			var context = await this.browser.createIncognitoBrowserContext()
			this.reserver_tabs[`${tab_id}`]=await context.newPage();
			this.reserver_tabs[`${tab_id}`].reserver_id=tab_id;
			switch(tab_id){
				case '0':
					await this.reserver_tabs[`${tab_id}`].goto('https://www.midasbuy.com/midasbuy/ot/buy/pubgm?fbclid=IwAR0MVZCms7Fm7Tg7t8pj8YGWxwoaZhlNSd8D00CjILrLNcU4TiL5Q7WhIOc',{waitUntil: 'load', timeout: 0});
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
					//await this.reserver_tabs[`${tab_id}`].setViewport({ width: 1366, height: 768});
					await this.reserver_tabs[`${tab_id}`].goto('https://shop2game.com/app',{waitUntil: 'load', timeout: 0});
					break;					
			}
		}
		this.clous_firest_blank_page_if_open()	
	}

	async clous_firest_blank_page_if_open(){
		if(!this.clous_firest_blank_page_state){
			const pages = await this.browser.pages();
			if (pages.length > 1) {
			    await pages[0].close();
			}
			this.clous_firest_blank_page_state=true		
		}
	}

	async realod(reserver){
		console.time(`${reserver.reserver_id} realod time : `);
		await reserver.deleteCookie({
            name : 'PHPSESSID',
            domain : "pod.mohp.gov.eg"
        })
		await reserver.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
		console.timeEnd(`${reserver.reserver_id} realod time : `);
	}	

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}


module.exports= new Manager_Browser


//http://api.scrape.do?token=70dfaca2ba814e1e87f9fd0b81b02983585d1611459&url=https://shop2game.com/app/
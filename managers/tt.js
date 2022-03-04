/**
* This test uses the real Google Chrome browser and a module 
* to randomize and automate mouse movements: https://www.npmjs.com/package/ghost-cursor
* 
*/
const createCursor = require("ghost-cursor").createCursor;
const puppeteer = require('puppeteer-core');
const exec = require('child_process').exec;
const fs = require('fs');

// change this mofo when necessary
const GOOGLE_CHROME_BINARY = 'C:\\Program Files\\Google\\Chrome\\Application';

function sleep(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}

function execute(command, callback){
 exec(command, function(error, stdout, stderr){ callback(stdout); });
}

/**
* Poll browser.log periodically until we see the wsEndpoint
* that we use to connect to the browser.
*/
async function getWsEndpoint() {
 let wsEndointFile = './browser.log';
 for (let i = 1; i <= 10; i++) {
   await sleep(500);
   if (fs.existsSync(wsEndointFile)) {
     let logContents = fs.readFileSync(wsEndointFile).toString();
     var regex = /DevTools listening on (.*)/gi;
     let match = regex.exec(logContents);
     if (match) {
       return match[1];
     }
   }
 }
 console.log('Could not get wsEndpoint');
 process.exit(0);
}

/**
* This is a more advanced way to solve the Bot Challenge.
* 
* Here we make use of human like mouse movements with the 
* awesome npm module ghost-cursor https://www.npmjs.com/package/ghost-cursor
* 
* The cursor created with const cursor = createCursor(page); moves 
* with a Bezier Curve in a random fashion to the target selector.
*/
async function ghostCursorSolveChallenge(page) {
 // handle the dialog
 page.on('dialog', async dialog => {
   console.log(dialog.message());
   await dialog.accept();
 });

 const cursor = createCursor(page);
 await page.waitForSelector('#formStuff');

 await cursor.click('[name="userName"]')
 const userNameInput = await page.$('[name="userName"]');
 await page.evaluate(() => {
   document.querySelector('[name="userName"]').value = '';
 });
 await userNameInput.type("bot3000");

 await cursor.click('[name="eMail"]')
 const emailInput = await page.$('[name="eMail"]');
 await page.evaluate(() => {
   document.querySelector('[name="eMail"]').value = '';
 });
 await emailInput.type("bot3000@gmail.com");

 await page.select('[name="cookies"]', 'I want all the Cookies');

 await cursor.click('[name="terms"]')
 await cursor.click('#bigCat')

 // submit the form
 await cursor.click('#submit')

 // wait for results to appear
 await page.waitForSelector('#tableStuff tbody tr .url');
 // just in case
 await sleep(100);

 // now update both prices
 // by clicking on the "Update Price" button
 await page.waitForSelector('#updatePrice0');
 await cursor.click('#updatePrice0')
 await page.waitForFunction('!!document.getElementById("price0").getAttribute("data-last-update")');

 await page.waitForSelector('#updatePrice1');
 await cursor.click('#updatePrice1')
 await page.waitForFunction('!!document.getElementById("price1").getAttribute("data-last-update")');

 // now scrape the response
 let data = await page.evaluate(function () {
   let results = [];
   document.querySelectorAll('#tableStuff tbody tr').forEach((row) => {
     results.push({
       name: row.querySelector('.name').innerText,
       price: row.querySelector('.price').innerText,
       url: row.querySelector('.url').innerText,
     })
   })
   return results;
 })

 console.log(data)
}

(async () => {
 // start browser
 const command = GOOGLE_CHROME_BINARY + ' --remote-debugging-port=9222 --no-first-run --no-default-browser-check 2> browser.log &';
 execute(command, (stdout) => {
   console.log(stdout);
 });

 // now connect to the browser
 // we do not start the brwoser with puppeteer,
 // because we want to influence the startup process
 // as little as possible
 const browser = await puppeteer.connect({
   browserWSEndpoint: await getWsEndpoint(),
   defaultViewport: null,
 });

 const page = await browser.newPage();

 await page.goto('https://bot.incolumitas.com/');

 await ghostCursorSolveChallenge(page);

 await sleep(5000);

 await page.screenshot({path: "bot.png", fullPage: true});

 const new_tests = JSON.parse(await page.$eval('#new-tests', el => el.textContent));
 const old_tests = JSON.parse(await page.$eval('#detection-tests', el => el.textContent));

 console.log(new_tests);
 console.log(old_tests);

 await page.close();
 await browser.close();
})();
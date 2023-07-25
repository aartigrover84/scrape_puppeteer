const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

const {executablePath} = require('puppeteer')

async function run () {
    
    const browser = await puppeteer.launch({ headless: false, executablePath : executablePath() });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
    });
    await page.goto('https://web.quantsapp.com/home')
    await page.waitForSelector('input[type="email"]')
    //await page.click('img[src="https://s3.ap-south-1.amazonaws.com/images.quantsapp.com/webapp/assets/google.png"]');
    let submitLink = await page.$('img[src="https://s3.ap-south-1.amazonaws.com/images.quantsapp.com/webapp/assets/google.png"]');
    await page.evaluateHandle((submit) => { submit.click(); 
        document.querySelector('input[type="email"]').value = 'anil.sharma11@gmail.com';
        //document.querySelector('form[name="f"]').submit();
    }, submitLink);

    
    

    //await page.waitForSelector('text/Email or phone');
    //await page.type('input[type="email"]', 'anil.sharma11@gmail.com');
    /*await Promise.all([
        //page.waitForNavigation(),
        //return Promise.resolve(1);
        await page.waitForSelector('input[type="email"]'),
        await page.type('input[type="email"]', 'anil.sharma11@gmail.com')
    ]);*/
    //page.waitForNavigation();
    //await page.click('img.img-login')
    //await page.waitForSelector('div > .img-login')
    //await page.waitForSelector('input[type="email"]')
    //await page.click('img.img-login')
    //await Promise.all([
        
    //]);

    //await page.keyboard.pre
    //await page.waitForSelector('#resultsCol')
    //await page.goto('https://accounts.google.com/o/oauth2/auth/identifier?redirect_uri=storagerelay%3A%2F%2Fhttps%2Fweb.quantsapp.com%3Fid%3Dauth919924&response_type=permission%20id_token&scope=email%20profile%20openid&openid.realm&include_granted_scopes=true&client_id=896311347621-8qjf41lqgcadpel53ac1vl8vissnqnls.apps.googleusercontent.com&ss_domain=https%3A%2F%2Fweb.quantsapp.com&fetch_basic_profile=true&gsiwebsdk=2&service=lso&o2v=1&flowName=GeneralOAuthFlow');
    /*await page.waitForSelector('input[type="email"]')
    await page.type('input[type="email"]', 'anil.sharma11@gmail.com');
    await Promise.all([
        page.waitForNavigation(),
        await page.keyboard.press('Enter')
    ]);


    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', 'Marijuna4me$');
    
    const res = await Promise.all([
        page.waitForNavigation(30000)
     
        //page.waitForFunction(() => location.href === 'https://web.quantsapp.com/home'),
        //await page.waitForSelector('img > .img-login')
        //await page.keyboard.press('Enter')
      //page.goto('https://web.quantsapp.com/option-scalping?tab=all')

    ]);*/

    await page.screenshot({path: 'screenshot.png'});
    //browser.close();
};

run();
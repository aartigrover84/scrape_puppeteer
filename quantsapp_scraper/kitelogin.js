const puppeteer = require('puppeteer');
const fs = require('fs');

async function run () {
    try{
      const wsChromeEndpointUrl ='ws://127.0.0.1:9222/devtools/browser/1aae012b-5a2c-46cb-ad4a-a5c4d548ce7b'
      //const browser = await puppeteer.launch({ headless: false  });
      const hdrs = '{"__stripe_mid"="d48d0433-7aef-4fa0-aaf9-4e52581793326a6928";"g_state"="{"i_l":0}";"_gcl_au"="1.1.162830755.1687805486";"_fbp"="fb.1.1687805486954.1414980775";"_gid"="GA1.2.1401071602.1689652941";"_ga_EJFV4WHJND"="GS1.1.1689825321.7.0.1689825321.0.0.0";"_ga_RYFTNQPB8X"="GS1.1.1689825321.7.0.1689825321.0.0.0";"_ga_KGMN0QY5YZ"="GS1.1.1689825327.89.1.1689825338.0.0.0";"_ga"="GA1.2.1537382331.1678680150";"_gat_gtag_UA_82128641_1"="1";"_ga_7BQQ2CCB8S"="GS1.1.1689825326.108.1.1689825434.0.0.0"}';
      const browser = await puppeteer.connect({browserWSEndpoint: wsChromeEndpointUrl, headers: hdrs});
  
      page = await browser.newPage();
      let pageUrl = 'https://kite.zerodha.com/connect/login?v=3&api_key=fotp0ezoezwdu1nb';

      await page.setViewport({ width: 1920, height: 1080 });
  
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
       )

      await page.goto(pageUrl, {
          waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
      
      });

      await page.waitForTimeout(5000)
      //await page.waitUntil(5000);
      //await readLiquidityData(page);
      //awaitpage.wai

    }catch(error){
      console.error(error)
    }
  };

  run();
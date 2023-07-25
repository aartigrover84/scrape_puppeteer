const puppeteer = require('puppeteer');
const fs = require('fs');
const db = require('./db.config');
data_global_str = []
data_global = []
const today = new Date(Date.now());

async function run () {
    try{
      const wsChromeEndpointUrl ='ws://127.0.0.1:9222/devtools/browser/d3915d22-af54-40d6-a5f1-b8bf2b14f225'
      //const browser = await puppeteer.launch({ headless: false  });
      const hdrs = '{"__stripe_mid"="d48d0433-7aef-4fa0-aaf9-4e52581793326a6928";"g_state"="{"i_l":0}";"_gcl_au"="1.1.162830755.1687805486";"_fbp"="fb.1.1687805486954.1414980775";"_ga_7BQQ2CCB8S"="deleted";"_gid"="GA1.2.519472057.1690171303";"_ga_EJFV4WHJND"="GS1.1.1690228672.12.0.1690228672.0.0.0";"_ga_RYFTNQPB8X"="GS1.1.1690228672.12.0.1690228672.0.0.0";"_ga"="GA1.2.1537382331.1678680150";"_gat_gtag_UA_82128641_1"="1";"_ga_7BQQ2CCB8S"="GS1.1.1690257438.116.1.1690257570.0.0.0";"_ga_KGMN0QY5YZ"="GS1.1.1690257438.96.1.1690257570.0.0.0"}';
      const browser = await puppeteer.connect({browserWSEndpoint: wsChromeEndpointUrl, headers: hdrs});
  
      page = await browser.newPage();
      let pageUrl = 'https://web.quantsapp.com/liquidity-finder?filter=symbol&sort=symbol&order=ascending';

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

      await readLiquidityData(page);
    }catch(error){
      console.error(error)
    }
  };

  const getDate = () => {

    let date = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    return year + "-" + month + "-" + date;
  }

  const readLiquidityData = async(page) => {
    //setTimeout(5000);
    dt = getDate();
    data = await page.evaluate( () => {
      const tds = Array.from(document.querySelectorAll("div.total_rate_content"));
      
      liquidities = tds.map(liquidity => ( [
        //callRating:  liquidity.querySelector("div.rate_expression > div.rating_val").querySelector("span.value").innerText,
        //symbol:     liquidity.querySelector("div.rating_symbol").querySelector("p.text").innerText,
        //putRating:  liquidity.querySelector("div.rating_expression > div.rating_val").querySelector("span.value").innerText
        liquidity.querySelector("div.rating_symbol").querySelector("p.text").innerText,
        liquidity.querySelector("div.rate_expression > div.rating_val").querySelector("span.value").innerText, 
        liquidity.querySelector("div.rating_expression > div.rating_val").querySelector("span.value").innerText
      ]));
      return liquidities;
    });
    console.log(dt);
    //data[0].push('2023-3-4');
    console.log(data[0]);
    console.log(data[1]);
    

    data.forEach(element => {
      element[3] = dt;
    })
    console.log(data[0]);
    insert_to_db(data)
  }

  
  
  async function insert_to_db(data_global){
    let query = 'INSERT INTO quantsapp.options_liquidity (symbol, call_rating, put_rating, dttm) VALUES ?;';
    try {
      let rows = await new Promise((resolve,reject)=>{
        db.query(query,[data_global], (err, rows) =>{
          if (err) {
            console.log(`
              * * * * * * * * * * * * * * * * ERROR* * * * * * * * * * * * * * * * * \n
            `);
            console.error({ err });
            reject(err);
          // throw err;
          } else {
            console.log('DB insert successful');
            resolve(rows);
          }
        });  
      });
    } catch (error) {
      console.error("Something went wrong");
      console.error(error)
    }
  }



  run();
const puppeteer = require('puppeteer');
const fs = require('fs');
const db = require('./db.config');
const kfk_producer =  require('./kafka/producer.js');
const csv = require('csvtojson')
data_global_str = []
data_global = []
const today = new Date(Date.now());

async function send_to_kafka(data_global){
  data_global.forEach(line => {
    /*var opdata = { "dttm" : line[0]
          , "symbol" : line[1]
          , "instrument" : line[2]
          , "cmp" : line[3]
          , "signal" : line[4]
    };*/
    //console.log(opdata);
    //var opdata = "dttm:"+ line[0] + ",symbol:"+ line[1] + ",instrument:"+ line[2]+",cmp:"+line[3]+",signal:"+line[4]
    var opdata = line[0] + "," + line[1] + ","  + line[2] + "," + line[3] + "," + line[4]
    kfk_producer.send({
      topic: 'options_log',
      
      messages: [{
        key: 'options_log',
        //value: JSON.stringify(opdata)
        value: opdata
      }]
    })
  })
  /*for (var line in data_global){
    var opdata = { "dttm" : line[0]
          , "symbol" : line[1]
          , "instrument" : line[2]
          , "cmp" : line[3]
          , "signal" : line[4]
    };*/
    //console.log(data_global[0][0])

  
  
  /*await kfk_producer.send({
    topic: 'topic_trades',

    messages: [{
      key: 'options_data',
      value: data_global[0]
    }]
  })*/
}

async function insert_to_db(data_global){
  let query = 'INSERT INTO quantsapp.options_data (time, symbol, instrument, cmp, `signal`) VALUES ?;';
  try {
    console.log(data_global[0])
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


let count = 1;
const readOptionData = async(page) => {
  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tbody div tr'))
    return tds.map(td => td.innerText)
  });
  //console.log(data.length);
  var difference = data.filter(x => !data_global_str.includes(x));
  //console.log("diff::"+ difference)
  data_global_str = data_global_str.concat(difference)
  
  let diffVals = [];
  
  if (difference.length > 0){
    console.log("refreshing new data at: " +new Date() + "and received : " + difference.length + " records");
    difference.forEach(element => {
      var values = element.split("\t");
      values[0] = getDate().concat(" ").concat(values[0]);
      diffVals.push(values.slice(0,5));
      //console.log(element)
    });
  //console.log(data_global)

    insert_to_db(diffVals);
    send_to_kafka(diffVals);
  }
  //count++;
  //if (count <15)
  return readOptionData(page);
}

const getDate = () => {

  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  return year + "-" + month + "-" + date;
}

const refresh = async(page) => {
  await page.evaluate(() => {
    console.log("refresh clicked")
    document.querySelector('div mat-icon.mat-icon.notranslate.mat-tooltip-trigger').click();
  });
  //await readOptionData(page);
  setTimeout(refresh, 60000, page);
}
let page = null;

async function run () {
  try{
    const wsChromeEndpointUrl ='ws://127.0.0.1:9222/devtools/browser/d3915d22-af54-40d6-a5f1-b8bf2b14f225'
    //const browser = await puppeteer.launch({ headless: false  });
    const hdrs = '{"__stripe_mid"="d48d0433-7aef-4fa0-aaf9-4e52581793326a6928";"g_state"="{"i_l":0}";"_gcl_au"="1.1.162830755.1687805486";"_fbp"="fb.1.1687805486954.1414980775";"_ga_7BQQ2CCB8S"="deleted";"_gid"="GA1.2.519472057.1690171303";"_ga_EJFV4WHJND"="GS1.1.1690228672.12.0.1690228672.0.0.0";"_ga_RYFTNQPB8X"="GS1.1.1690228672.12.0.1690228672.0.0.0";"_ga"="GA1.2.1537382331.1678680150";"_gat_gtag_UA_82128641_1"="1";"_ga_7BQQ2CCB8S"="GS1.1.1690257438.116.1.1690257570.0.0.0";"_ga_KGMN0QY5YZ"="GS1.1.1690257438.96.1.1690257570.0.0.0"}';
    const browser = await puppeteer.connect({browserWSEndpoint: wsChromeEndpointUrl, headers: hdrs});

    page = await browser.newPage();
    let pageUrl = 'https://web.quantsapp.com/option-scalping?tab=all';

    await page.goto(pageUrl, {
        waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
    
    });
    

    await refresh(page);
    await readOptionData(page);
    //console.log(data);
  }catch(error){
    console.error(error)
  }
};



run();
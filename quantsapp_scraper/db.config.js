const mysql = require("mysql2");
  
// Creating connection
let db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mango4me$",
  database: "quantsapp"
});
  
// Connect to MySQL server

    db_con.connect((err) => {
        if (err) {
          console.log("Database Connection Failed !!!", err);
        } else {
          console.log("connected to Database");
        }
      });


  
module.exports = db_con;

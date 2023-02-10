var express = require ('express')
var bodyParser= require ('body-parser')

var session = require ('express-session');
var validator = require ('express-validator');

//xonst express sanitizer 
const expressSanitizer = require('express-sanitizer');
//const mysql = require('mysql');
const app = express()
const port = 8000
/*
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'cat',
    database: 'myBookshop'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
*/
//mongo code ///


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mybookshopdb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

// express sanitizer
app.use(expressSanitizer());

///added for session management
app.use(session({
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
////////////

app.use(bodyParser.urlencoded({ extended: true }))

// new code added to your Express web server
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//////////////

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

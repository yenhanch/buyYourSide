//app.js

/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
var dbUrl = "mongodb://yenhanchen:1qaz2wsx3edc@ds043952.mongolab.com:43952/yenhanch"

var mongoClient = require('mongodb').MongoClient
var url = require('url')

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('landingpage',
  { title : 'Buyyourside -- purchase aroud the globe',
    message: "Welcome to Buyyourside! We provide the matching service for you to purchase or sell around the globe." }
  )
})

app.post('/signup', function(req,res){
  console.log(req.body);
})

app.get('/api/needs', function (req, res) {
  var parsedUrl = url.parse(req.url, true)
  mongoClient.connect(dbUrl, function(err, db){
    //do the insert stuff here
    if(err) throw err

    var collection = db.collection('customerRequests')
    collection.insert(parsedUrl.query, function(err, data){
      if(err) throw err
      console.log("insert document "+JSON.stringify(parsedUrl.query)+" into collection customerRequests")
      res.render('index',
      { title : 'Home', message: "insert document "+JSON.stringify(parsedUrl.query)+" into collection customerRequests\n" }
      )

      db.close()
    })
                    

  })
  
})

app.get('/api/print', function (req, res) {
  mongoClient.connect(dbUrl, function(err, db){
    //do the insert stuff here
    if(err) throw err

    
    var collection = db.collection('customerRequests')
    collection.find({},{username: 1, item: 1, _id: 0}).toArray(function(err, customerRequestsArray){
      console.log("Printing table...\n"+JSON.stringify(customerRequestsArray))
      res.render('index',
      { title : 'Home', message: JSON.stringify(customerRequestsArray) }
      )
        
      db.close()
    })
                    

  })
  
})

app.listen(3000)
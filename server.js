//server.js -- respond to various kinds of requests
//
//Request types: 1. Post a need, 2. Print table, 3. Fulfill a need 
//

//Run the server
// load http module
var dbUrl = "mongodb://yenhanchen:1qaz2wsx3edc@ds043952.mongolab.com:43952/yenhanch"

var mongoClient = require('mongodb').MongoClient

var http = require('http');
var url = require('url')

var s = http.createServer(function(req, res) {
            console.log("request: ", req.url);
            if(req.method!='GET')
                return res.end('Send me a GET request!')

            res.writeHead(200, { 'content-type': 'text/plain' });            
            res.write("hello world\n");


            var parsedUrl = url.parse(req.url, true)
            console.log(parsedUrl.query)
            //1. Post a need
            if(parsedUrl.pathname=='/api/need') {
                mongoClient.connect(dbUrl, function(err, db){
                    //do the insert stuff here
                    if(err) throw err

                    var collection = db.collection('customerRequests')
                    collection.insert(parsedUrl.query, function(err, data){
                        if(err) throw err
                        console.log("insert document "+JSON.stringify(parsedUrl.query)+" into collection customerRequests")
                        res.write("insert document "+JSON.stringify(parsedUrl.query)+" into collection customerRequests\n")
                        res.end("receive a request, your need has been posted")

                        db.close()
                    })
                    

                })
            }

            //2. Print table
            else if(parsedUrl.pathname=='/api/print') {
                mongoClient.connect(dbUrl, function(err, db){
                    //do the insert stuff here
                    if(err) throw err

                    var collection = db.collection('customerRequests')
                    collection.find({username: "yenhanch"},{username: 1, item: 1, _id: 0}).toArray(function(err, customerRequestsArray){
                        console.log("Printing table...\n"+JSON.stringify(customerRequestsArray))
                        res.write(JSON.stringify(customerRequestsArray))
                        res.end("receive a request, table printed")

                        db.close()

                    })
                    

                })
            }

            else if(parsedUrl.pathname=='/api/buy') {
                res.end("receive your request, buy!!")
            }

            else {
                res.end("unknown request!! Please try again.")
            }
            
            
        });

s.listen(8000);
console.log("server started on port " + s.address().port);
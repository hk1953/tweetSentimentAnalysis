var twitter = require('twitter');
var elasticsearch = require('aws-es');
var express = require('express');
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http'),
    SNSClient = require('aws-snsclient');

//AWS Credentials and elastic search host name
elasticSearch = new elasticsearch({
    accessKeyId: 'Enter Your Key',
    secretAccessKey: 'Enter Your Key',
    service: 'es',
    region: 'us-west-2',
    host: 'Enter Your Elastic Search Endpoint'
});

var index = 'tweetstwitter';

var Type = 'Tweetsss';

var port = 3000;

var i; //to keep track of the id of the posts being made
//This search operation helps retrieve the id of the latest record
elasticSearch.search({
    index: index,
    type: Type,
    body: {
        query: {
            match_all: {}
        },
        sort: {
            timestamp: "desc"
        },
        size: 1
    }
}, function(err, data) {
    if (data.status == 404) {
        i = 1;
        return;
    }


    if (data.hits.hits[0] == undefined) {
        i = 1;
    } else
        i = parseInt(data.hits.hits[0]._id) + 1;

});

var client = SNSClient(function(err, message) {  //Subscribtion
    console.log(message);
    var messageProcess = message.Message.split("===");
    elasticSearch.index({ //Posting of the tweets to elasticSearch	
        index: index,
        type: Type,
        id: String(i),
        body: {
            text: messageProcess[0],
            latitude: messageProcess[1],
            longitude: messageProcess[2],
            emotion: messageProcess[3],
            timestamp: Date.now()
        }
    }, function(err, data) {
        console.log(data);
        i = i + 1;
    });
});

http.createServer(function(req, res) {
    if (req.method === 'POST' && req.url === '/receive') {
        return client(req, res);
    }
    res.writeHead(404);
    res.end('Not found.');
}).listen(9000);

connect().use(serveStatic(__dirname)).listen(port, function(){	   //Server listening at the following port
    console.log('Server running on '+port+'...');
});

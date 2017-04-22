var twitter = require('twitter');
var elasticsearch = require('aws-es');
var express = require('express');
var connect = require('connect');
var serveStatic = require('serve-static');
var kafka = require('kafka-node');

var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);


//Twitter App Credentials
var twitClient = new twitter({
    consumer_key: 'Enter Your Key',
    consumer_secret: 'Enter Your Key',
    access_token_key: 'Enter Your Key',
    access_token_secret: 'Enter Your Key'
});

var topic = 'tweets';

var port = 3000;

var tweetStream = twitClient.stream('statuses/filter', {
    track: 'trump,weather,Game,Obama,samsung,space,earth,ghost,india,usa' //tweets with the following keywords are being fetched
});

producer.on('ready', function() {
    tweetStream.on('data', function(tweetResp) {
        if (tweetResp.lang == 'en') { //Checking if the tweets are in English
            if (tweetResp.coordinates != null) { //Checking if coordinates exist for the tweet
                console.log(tweetResp.text + " " + tweetResp.coordinates.coordinates[1] + " " + tweetResp.coordinates.coordinates[0]);
                var payloads = [{
                    topic: topic,
                    messages: tweetResp.text + "===" + tweetResp.coordinates.coordinates[1] + "===" + tweetResp.coordinates.coordinates[0],
                    partition: 0
                }];
                producer.send(payloads, function(err, data) {    //Sending the tweets to the above mentioned Kafka Topic
                    console.log(data);
                });
            } else if (tweetResp.place != null) { //Checking if the place coordinates exist in the tweet
                var lat1 = tweetResp.place.bounding_box.coordinates[0][0][1];
                var long1 = tweetResp.place.bounding_box.coordinates[0][0][0];

                var lat2 = tweetResp.place.bounding_box.coordinates[0][2][1];
                var long2 = tweetResp.place.bounding_box.coordinates[0][2][0];

                var lat = (lat1 + lat2) / 2;
                var long = (long1 + long2) / 2;
                console.log(tweetResp.text + " " + lat + " " + long);
                var payloads = [{
                    topic: topic,
                    messages: tweetResp.text + "===" + lat + "===" + long,
                    partition: 0
                }];
                producer.send(payloads, function(err, data) {	//Sending the tweets to the above mentioned Kafka Topic
                    console.log(data);
                });
            }
        }

    });

    tweetStream.on('error', function(error) {
        console.log(error);
    });

});

producer.on('error', function(err) {})

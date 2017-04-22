var workerpool = require('workerpool');
var kafka = require('kafka-node');

topic = 'tweets';

var Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client, [{
            topic: topic,
            partition: 0
        }], {
            autoCommit: false
        }
    );

var pool = workerpool.pool('Worker.js', [{	//Configuring the worker in worker.js file
    'minWorkers': 3,		
    'maxWorkers': 4
}]);

consumer.on('message', function(message) {
    //console.log(message.value);
    var text = message.value;
    pool.exec('process', [text])
        .then(function() {

        });
    console.log(pool.stats());
});

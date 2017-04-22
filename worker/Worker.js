var workerpool = require('workerpool');
var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: 'Enter Your Key',
    secretAccessKey: 'Enter Your Key',
    region: 'us-west-2'
});
var sns = new aws.SNS();
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
//Natural Language Understanding credentials
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': 'Enter Your Username',
    'password': 'Enter Your Password',
    'version_date': '2017-02-27'
});

var topicArn = 'Enter Your Topic Arn';

function process(text) {
    var parameters = {
        'text': text,
        'features': {
            'sentiment': {

            }
        }
    };

    natural_language_understanding.analyze(parameters, function(err, response) {  //Analysis of the messages
        if (err)
            console.log('error:', err);
        else
            console.log(response.sentiment.document.label);
        var params = {
            Message: text + "===" + response.sentiment.document.label,
            TopicArn: topicArn
        };
        sns.publish(params, function(err, data) {	//publishing the messages to the above mentioned topic
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    });
}

workerpool.worker({
    process: process
});

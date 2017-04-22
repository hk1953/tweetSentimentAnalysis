# tweetSentimentAnalysis

![alt tag](https://github.com/hk1953/tweetSentimentAnalysis/blob/master/screenshot.png)

Render Tweets on Google Maps by location with the marker encoded with colors representing Positive, Negative and Neutral tweets.
1. Streaming Server Code fetches tweets from twitter, and checks if its in english and has coordinates. It then sends the tweets to a topic in kafka.
2. The worker pool has multiple workers (max workers: 4) that fetches incoming records from kafka, performs sentimental analysis on the same and then notifies the http endpoint using SNS.
3. Finally the server.js file subscribes to the records being sent via SNS, and stores the same in Elastic Search, which is then populated in a google map.
4. Also, the markers in the google map correspond to the type of sentiment being projected by the tweets. Like Green for positive, orange for negative and yellow for neutral tweets.

Reference:
1. https://www.npmjs.com/package/kafka-node
2. http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
3. https://www.npmjs.com/package/aws-snsclient

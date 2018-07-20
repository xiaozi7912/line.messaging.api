'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server
const request = require('request');
const crypto = require('crypto');

const APP_ACCESS_TOKEN = process.env.APP_ACCESS_TOKEN;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string
const body = ''; // Request body string
const signature = crypto.createHmac('SHA256', channelSecret).update(body).digest('base64');
// Compare X-Line-Signature request header and the signature

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    res.status(200).send('Success');
});

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
    let body = req.body;
    console.log(body);

    res.status(200).send('Success');
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    console.log('handleMessage');
    console.log('handleMessage received_message : ' + received_message);
    console.log('handleMessage received_message.text : ' + received_message.text);
    let response;

    // Check if the message contains text
    if (received_message.text == 'hello') {

        // Create the payload for a basic text message
        response = {
            "text": 'hi'
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    console.log('handlePostback');
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    console.log('callSendAPI');
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": APP_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log(body);
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
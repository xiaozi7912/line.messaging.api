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
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET; // Channel secret string
const LINE_CHANNEL_TOKEN = process.env.LINE_CHANNEL_TOKEN;
const body = ''; // Request body string
const signature = crypto.createHmac('SHA256', LINE_CHANNEL_SECRET).update(body).digest('base64');
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

    let webhook_event = body.events[0];

    if (webhook_event) {
        console.log(webhook_event);
        console.log(webhook_event.source);
        console.log(webhook_event.message);
        console.log(webhook_event.replyToken);
        let type = webhook_event.type;
        let replyToken = webhook_event.replyToken;

        if (type == 'message') {
            let messageType = webhook_event.message.type;
            let messageText = webhook_event.message.text
            if (messageType == 'text') {
                handleMessage(replyToken, messageText);
            }
        }
        res.status(200).send('Success');
    } else {
        res.sendStatus(403);
    }
});

function handleMessage(replyToken, received_message) {
    console.log('handleMessage');
    console.log('handleMessage replyToken : ' + replyToken);
    console.log('handleMessage received_message : ' + received_message);
    let response;

    if (received_message == 'aaaa') {
        response = [{
            "type": "text",
            "text": "Hello"
        }, {
            "type": "text",
            "text": `You texted ${received_message}`
        }];
        callReplyAPI(replyToken, response);
    }
}

function callReplyAPI(replyToken, response) {
    console.log('replyToken');
    console.log('replyToken replyToken : ' + replyToken);
    console.log(response);

    let request_body = {
        'replyToken': replyToken,
        'messages': response
    };
    let request_options = {
        "uri": "https://api.line.me/v2/bot/message/reply",
        "headers": {
            "Authorization": `Bearer ${LINE_CHANNEL_TOKEN}`
        },
        "method": "POST",
        "json": request_body
    }
    console.log(request_options);

    request(request_options, (err, res, body) => {
        if (!err) {
            console.log(body);
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
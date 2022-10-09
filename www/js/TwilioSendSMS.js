// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC7491f2f7f2a2c056431d5366492120ed';
const authToken = 'e2810287a829adbef2928a50161e72ea';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+12056354601',
        to: '+61412746478'
    })
    .then(message => console.log(message.sid));

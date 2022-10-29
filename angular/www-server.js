const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 8000

express()
    .use('/', express.static(__dirname +  '/'))
    .get('/*', function(req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

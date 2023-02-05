"use strict";

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
   app.listen(25223);
}

require("greenlock-express")
    .init({
        packageRoot: __dirname,
        configDir: "./greenlock.d",

        // contact for security and critical bug notices
        maintainerEmail: "me@gavinmach.com",

        // whether or not to run at cloudscale
        cluster: false
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);
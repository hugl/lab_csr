var express = require('express');

var app = express()
    .use(express.static(__dirname+'/'))
    .listen(3000);

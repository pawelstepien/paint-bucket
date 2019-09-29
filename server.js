const express = require('express');
const app = express();
const http = require('http').createServer(app);
app.use(express.static('./public/'))

http.listen(1337, () => {
    console.log('listening on *:1337');
});
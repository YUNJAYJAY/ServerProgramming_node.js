const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.listen(8080, function(){
    console.log("포트 8080으로 대기중...")
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/book', function(req, res){
    res.send('도서 목록 페이지입니다.');
});
app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
});
app.post('/save', function(req, res){
    console.log(req);
    console.log("Save Done");
});
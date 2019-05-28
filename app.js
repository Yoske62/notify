const http = require('http');
const port = process.env.PORT || 3000
const messages = [];
messages.push({
  id: 0,
  title: 'some title',
  message: 'some message'
});
getMessages = function (type) {
  if (type == "HTML") {
    return messages.map(message => `<li><b>${message.title}: </b>${message.message}</li>`).join(' ');
  } else if (type == "LENGTH") {
    return messages.length;
  } else {
    return messages;
  }
}
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const html = `<h1>Messages:</h1><ul>${getMessages('HTML')}</ul><h3>${getMessages('LENGTH')} item/s</h3>`
  res.send(html);
})
app.get('/messages', function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
  res.send(messages);
})
app.post('/message', function (req, res) {
  let id = parseInt(Math.random() * 1000)
  messages.push({
    title: req.body.title,
    message: req.body.message,
    id: id
  })
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
  res.end(`${id}`);
})
app.post('/remove', function (req, res) {
  const id  = req.body.id;
  if (id){
    const index = messages.findIndex(x => x.id == id);
    messages.splice(index, 1);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(`Deleted ${id}`);
  } else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/json');
    res.end(`${id} Not found `);
  }
})
app.delete('/messages',  function (req, res) {
  const id  = req.body.id;
  if (id){
    const index = messages.findIndex(x => x.id == id);
    messages.splice(index, 1);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(`Deleted ${id}`);
  } else {
    messages = [];
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(`Done!`);
  }
})
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})

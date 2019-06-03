const http = require('http');
const port = process.env.PORT || 3000
const messages = [];
const hosts = [];

getMessages = function (type) {
  if (type == "HTML") {
    return messages.map(message => `<li><b>${message.title}: </b>${message.message}</li>`).join(' ');
  } else if (type == "LENGTH") {
    return messages.length;
  } else {
    return messages;
  }
}
getHosts = function (type) {
  if (type == "HTML") {
    return hosts.map(host => `<li><b>${host.host}: </b>${host.ip} last request:${host.timestamp}</li>`).join(' ');
  } else if (type == "LENGTH") {
    return hosts.length;
  } else {
    return hosts;
  }
}
getIP = function (req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
app.get('/hosts', function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const html = `<h1>Hosts:</h1><ul>${getHosts('HTML')}</ul><h3>${getHosts('LENGTH')} host/s</h3>`
  res.send(html);
})
app.get('/messages', function (req, res) {
  const host = req.query.host;
  const ip = getIP(req);
  if (!hosts.find(x => x.host == host)) {
    hosts.push({host,ip, timestamp: new Date()});
  } else {
    const curr = hosts.find(x => x.ip == ip);
    if (curr) {
      curr.timestamp = new Date()
    }
  }
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
app.delete('/messages', function (req, res) {
  const id = req.body.id;
  if (id) {
    const index = messages.findIndex(x => x.id == id);
    messages.splice(index, 1);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(`Deleted ${id}`);
  } else {
    messages.splice(0, messages.length);
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

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello DevSecOps !\n');
});

server.listen(3000, () => console.log('Serveur demarre sur le port 3000'));

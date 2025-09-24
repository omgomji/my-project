const http = require('http');

const handler1 = (req, res) => {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
};

const handler2 = function(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('OM JI\n');
};

const server = http.createServer(handler2);

const port = 3000;
server.listen(port, () => {
 console.log(`Server running at http://localhost:${port}/`);
});
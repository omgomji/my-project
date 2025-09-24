var http = require('http');

function req(method, path, headers) {
  return new Promise(function (resolve) {
    var options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: headers || {}
    };
    var r = http.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () { resolve({ status: res.statusCode, body: body }); });
    });
    r.on('error', function (e) { resolve({ status: 0, body: String(e) }); });
    r.end();
  });
}

(async function () {
  // Ensure server already running at :3000
  console.log('Initial seats');
  console.log(await req('GET', '/seats'));

  // Two users attempt to lock the same seat simultaneously
  var p1 = req('POST', '/lock/5', { 'X-User-Id': 'u1' });
  var p2 = req('POST', '/lock/5', { 'X-User-Id': 'u2' });
  var r1 = await Promise.all([p1, p2]);
  console.log('Lock attempts (u1 & u2) ->', r1);

  // Try to confirm with correct and wrong users
  var c1 = await req('POST', '/confirm/5', { 'X-User-Id': 'u1' });
  console.log('u1 confirm ->', c1);
  var c2 = await req('POST', '/confirm/5', { 'X-User-Id': 'u2' });
  console.log('u2 confirm after booked ->', c2);

  // Confirm without lock
  var c3 = await req('POST', '/confirm/2', { 'X-User-Id': 'u1' });
  console.log('confirm without lock ->', c3);
})();

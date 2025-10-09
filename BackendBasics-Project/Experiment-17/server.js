const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = 'supersecretkey';
const TOKEN_HEADER = 'authorization';

app.use(express.json());

app.use(function (req, res, next) {
  var timestamp = new Date().toISOString();
  console.log('[' + timestamp + '] ' + req.method + ' ' + req.url);
  next();
});

var accounts = {
  user1: {
    username: 'user1',
    password: 'password123',
    balance: 1000
  }
};

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  });
}

function authenticateToken(req, res, next) {
  var header = req.headers[TOKEN_HEADER];
  if (!header || typeof header !== 'string') {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  var parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  jwt.verify(parts[1], JWT_SECRET, { algorithms: ['HS256'] }, function (err, decoded) {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  var account = accounts[username];
  if (!account || account.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  var token = generateToken({ username: account.username });
  res.status(200).json({ token: token });
});

app.get('/balance', authenticateToken, function (req, res) {
  var account = accounts[req.user.username];
  if (!account) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ balance: account.balance });
});

app.post('/deposit', authenticateToken, function (req, res) {
  var amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Deposit amount must be a positive number' });
  }

  var account = accounts[req.user.username];
  if (!account) {
    return res.status(404).json({ message: 'User not found' });
  }
  account.balance += amount;

  res.status(200).json({
    message: 'Deposited $' + amount,
    newBalance: account.balance
  });
});

app.post('/withdraw', authenticateToken, function (req, res) {
  var amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Withdrawal amount must be a positive number' });
  }

  var account = accounts[req.user.username];
  if (!account) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (amount > account.balance) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  account.balance -= amount;

  res.status(200).json({
    message: 'Withdrew $' + amount,
    newBalance: account.balance
  });
});

app.use(function (err, req, res, next) {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

if (require.main === module) {
  app.listen(port, function () {
    console.log('Server running on http://localhost:' + port);
  });
}

module.exports = app;

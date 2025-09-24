var express = require('express');
var app = express();

app.use(express.json());

// In-memory seats state
// Each seat: { status: 'available' | 'locked' | 'booked', lockedBy?: string, lockUntil?: number }
var TOTAL_SEATS = 10;
var LOCK_DURATION_MS = 60 * 1000; // 1 minute

var seats = {};
for (var i = 1; i <= TOTAL_SEATS; i++) {
  seats[i] = { status: 'available' };
}

function isLockActive(seat) {
  if (seat.status !== 'locked') return false;
  if (!seat.lockUntil) return false;
  return Date.now() < seat.lockUntil;
}

function cleanupExpiredLock(id) {
  var seat = seats[id];
  if (seat && seat.status === 'locked' && !isLockActive(seat)) {
    seats[id] = { status: 'available' };
  }
}

setInterval(function () {
  for (var id = 1; id <= TOTAL_SEATS; id++) {
    cleanupExpiredLock(id);
  }
}, 5000);

app.get('/seats', function (req, res) {
  for (var id = 1; id <= TOTAL_SEATS; id++) {
    cleanupExpiredLock(id);
  }
  res.json(seats);
});

app.post('/lock/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  if (!seats[id]) return res.status(404).json({ message: 'Seat not found' });

  cleanupExpiredLock(id);

  var seat = seats[id];
  if (seat.status === 'booked') {
    return res.status(400).json({ message: 'Seat is already booked' });
  }
  if (seat.status === 'locked' && isLockActive(seat)) {
    return res.status(400).json({ message: 'Seat is currently locked' });
  }

  var userId = req.header('X-User-Id') || 'anonymous';
  seats[id] = {
    status: 'locked',
    lockedBy: String(userId),
    lockUntil: Date.now() + LOCK_DURATION_MS
  };

  res.json({ message: 'Seat ' + id + ' locked successfully. Confirm within 1 minute.' });
});

app.post('/confirm/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  if (!seats[id]) return res.status(404).json({ message: 'Seat not found' });

  cleanupExpiredLock(id);

  var seat = seats[id];
  if (seat.status === 'booked') {
    return res.status(400).json({ message: 'Seat is already booked' });
  }
  if (seat.status !== 'locked' || !isLockActive(seat)) {
    return res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
  }

  var userId = req.header('X-User-Id') || 'anonymous';
  if (seat.lockedBy && seat.lockedBy !== String(userId)) {
    return res.status(403).json({ message: 'Seat locked by another user' });
  }

  seats[id] = { status: 'booked' };
  res.json({ message: 'Seat ' + id + ' booked successfully!' });
});

app.get('/', function (req, res) {
  res.send('<h2>Concurrent Ticket Booking System</h2><p>Use <code>/seats</code>, <code>/lock/:id</code>, <code>/confirm/:id</code></p>');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});

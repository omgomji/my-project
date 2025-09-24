var express = require('express');
var app = express();

app.use(express.json());

var cards = [
	{ id: 1, suit: 'Hearts', value: 'Ace' },
	{ id: 2, suit: 'Spades', value: 'King' },
	{ id: 3, suit: 'Diamonds', value: 'Queen' }
];

function getNextId() {
	if (cards.length === 0) return 1;
	var max = cards[0].id;
	for (var i = 1; i < cards.length; i++) {
		if (cards[i].id > max) max = cards[i].id;
	}
	return max + 1;
}

app.get('/cards', function (req, res) {
	res.json(cards);
});

app.get('/', function (req, res) {
	res.send(
		'<h2>Playing Cards API</h2>' +
			'<p>Try these endpoints:</p>' +
			'<ul>' +
			'<li>GET <code>/cards</code></li>' +
			'<li>GET <code>/cards/:id</code></li>' +
			'<li>PUT <code>/cards/:id</code> with JSON body { "suit": "...", "value": "..." }</li>' +
			'<li>POST <code>/cards</code> with JSON body { "suit": "Clubs", "value": "Jack" }</li>' +
			'<li>DELETE <code>/cards/:id</code></li>' +
			'</ul>'
	);
});

app.get('/cards/:id', function (req, res) {
	var id = parseInt(req.params.id, 10);
	var card = null;
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].id === id) {
			card = cards[i];
			break;
		}
	}
	if (!card) {
		return res.status(404).json({ message: 'Card not found' });
	}
	res.json(card);
});

app.post('/cards', function (req, res) {
	var suit = req.body && req.body.suit ? String(req.body.suit).trim() : '';
	var value = req.body && req.body.value ? String(req.body.value).trim() : '';

	if (!suit || !value) {
		return res.status(400).json({ message: 'Both suit and value are required' });
	}

	var newCard = {
		id: getNextId(),
		suit: suit,
		value: value
	};
	cards.push(newCard);
	res.status(201).json(newCard);
});

	// PUT /cards/:id - update a card by id (expects both suit and value)
	app.put('/cards/:id', function (req, res) {
		var id = parseInt(req.params.id, 10);
		var suit = req.body && req.body.suit ? String(req.body.suit).trim() : '';
		var value = req.body && req.body.value ? String(req.body.value).trim() : '';

		if (!suit || !value) {
			return res.status(400).json({ message: 'Both suit and value are required' });
		}

		var card = null;
		for (var i = 0; i < cards.length; i++) {
			if (cards[i].id === id) {
				card = cards[i];
				break;
			}
		}

		if (!card) {
			return res.status(404).json({ message: 'Card not found' });
		}

		card.suit = suit;
		card.value = value;
		res.json(card);
	});

app.delete('/cards/:id', function (req, res) {
	var id = parseInt(req.params.id, 10);
	var index = -1;
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].id === id) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		return res.status(404).json({ message: 'Card not found' });
	}
	var removed = cards.splice(index, 1)[0];
	res.json({ message: 'Card with ID ' + id + ' removed', card: removed });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log('Server running on http://localhost:' + PORT);
});
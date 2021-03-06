const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

require('dotenv').config();

const port = process.env.PORT || 5000;

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://notes-api.us.auth0.com/.well-known/jwks.json'
	}),

	audience: 'https://notes-api',
	issuer: 'https://notes-api.us.auth0.com/',
	algorithms: [ 'RS256' ]
});

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
	res.send('hello world');
});
app.use(checkJwt);
app.use('/api/notes', require('./routes/api/notes'));
app.use('/api/tags', require('./routes/api/tags'));

if (!module.parent) {
	app.listen(port, () => {
		console.log(`Server is running on port: ${port}`);
	});
}

module.exports = app;

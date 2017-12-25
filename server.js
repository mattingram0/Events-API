const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config'); // get our config file
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const path = require('path')
const reqIp = require('request-ip');

const app = express();
const port = (process.env.PORT || 8090); //BE CAREFUL ABOUT THIS WHEN DEPLOYING

app.use(cookieParser());
app.use(reqIp.mw());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('authKey', config.authKey);
app.set('eventKey', config.eventKey);

require('./routes/index.js')(app);
require('./routes/admin.js')(app);
require('./routes/auth.js')(app);

app.listen(port, () => {
	console.log('Listening on: ' + port);
});















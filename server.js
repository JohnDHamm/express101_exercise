'use strict';

const express = require('express');
const chalk = require('chalk');
const routes = require('./routes/') //assumes index in routes dir

const app = express(); //creates an instance of express server running - same as: new Express()
const bodyParser = require('body-parser');

const { connect } = require('./db/database');

// get port from environment and store in Express - in cl: PORT=1337 node server.js to set 1337 as port
const port = process.env.PORT || 3000 // 3000 is backup default port
app.set('port', port)



//view engine
app.set('view engine', 'pug');

if (process.env.NODE_ENV !== 'production') {
	app.locals.pretty = true;
}

app.locals.company = 'Pizza by Pug'; //used as global variable in head.pug

// middlewares
app.use((req, res, next) => { //mimicking http output
	let httpString = '';
	let method = chalk.cyan(`${req.method}`)
	httpString += '[' + new Date() + '] ' + method + ` ${req.url} ${req.headers["user-agent"]}`
	console.log(httpString);
	next();
})
//Scott's solution
//app.use(({method, url, headers: { 'user-agent': agent }} , res, next)) => {
	//console.log(`[${new Date()}] "${chalk.cyan(`${method} ${url}`)}" "${agent}"`)
	// next();
// }

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// app.set('views', 'templates'); //not needed if in views directory

//routes
app.use(routes);


// 404 catch and forward
app.use((req, res) =>
	// to throw error:
	// const err = Error('Not Found');
	// err.status = 404;
	// next(err); //send err object to error handling middleware
	res.render('404') // or custom 404 page
)


// Error handling middlewares

app.use((err, { method, url, headers: { 'user-agent': agent } }, res, next) => {
	res.sendStatus(err.status || 500)

	const timeStamp = new Date()
	const statusCode = res.statusCode
	const statusMessage = res.statusMessage

	console.error(
	  `[${timeStamp}] "${chalk.red(`${method} ${url}`)}" Error (${statusCode}): "${statusMessage}"`
	)
	console.error(err.stack)
})


connect()
	.then(() => {
		app.listen(port, () => {
			console.log(`Express server listening on port: ${port}`);
		});
	})
	.catch(console.error)



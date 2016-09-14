'use strict';

const { Router } = require('express');
const router = Router();
// const { db } = require('../database');
const Contact = require('../models/contact');

router.get('/', (req, res) => {
	res.render('index')
})

router.get('/about', (req, res) => {
	res.render('about', {page: 'About'})
})

router.get('/contact', (req, res) => {
	res.render('contact', {page: 'Contact'})
})

// const mongoose = require('mongoose');
// const Contact = mongoose.model('Contact');


router.post('/contact', (req, res) => {
	const msg = new Contact(req.body);
	msg.save()
		.then(() => res.redirect('/'))
		.catch(() => res.send('BAD'));


	// db().collection('contact')
	// 	.insertOne(req.body)
	// 	.then(() => res.redirect('/'))
	// 	.catch(() => res.send('BAD'));
	// console.log(req.body);

})

module.exports = router;

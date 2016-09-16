'use strict';

const { Router } = require('express');
const router = Router();
// const { db } = require('../database');
const Contact = require('../models/contact');
const Order = require('../models/order');
const Size = require('../models/size');
const Toppings = require('../models/toppings')

router.get('/', (req, res) => {
	res.render('index')
})

router.get('/about', (req, res) => {
	res.render('about', {page: 'About'})
})

router.get('/contact', (req, res) => {
	res.render('contact', {page: 'Contact'})
})

router.post('/contact', (req, res, err) =>
	Contact
		.create(req.body)
		.then(() => res.redirect('/'))
		.catch(err)
)

router.get('/order', (req, res, err) => {
	Promise.all([
		Size.find().sort({inches: 1}),
		Toppings.find({type: "meat"}).sort({name: 1}),
		Toppings.find({type: "veggie"}).sort({name: 1})
	]).then(([sizes, meats, veggies]) => res.render('order', { page: 'Order', sizes, meats, veggies}))
	.catch(err)
})

router.post('/order', (req, res, err) =>
	Order
		.create(req.body)
		.then(() => res.redirect('/thanks'))
		// .catch(() => res.render('order', msg: 'Fix the form please!', sizes, meats, veggies)
)

router.get('/thanks', (req, res) => {
	res.render('thanks', {page: 'Thanks'})
})

module.exports = router;

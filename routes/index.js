'use strict';

const { Router } = require('express');
const bcrypt = require('bcrypt')

const router = Router();

const Contact = require('../models/contact');
const Order = require('../models/order');
const Size = require('../models/size');
const Toppings = require('../models/toppings')
const User = require('../models/user')

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

router.get('/login', (req, res) =>
	res.render('login', {page: 'Login'})
)

router.post('/login', ({ session, body: { email, password } }, res, err) => {
	User.findOne({ email })
		.then(user => {
			if (user) {
				return new Promise((resolve, reject) => {
					bcrypt.compare(password, user.password, (err, matches) => {
						if (err) {
							reject(err)
						} else {
							resolve(matches)
						}
					})
				})
			} else {
				res.render('login', { msg: 'Email does not exist in our system' })
			}
		})
		.then((matches) => {
			if (matches) {
				session.email = email
				res.redirect('/')
			} else {
				res.render('login', { msg: 'Password does not match' })
			}
		})
		.catch(err)
})

router.get('/register', (req, res) =>
	res.render('register', {page: 'Register'})
)

router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
	if (password === confirmation) {
		User.findOne({ email })
			.then(user => {
				if (user) {
					res.render('register', { msg: 'Email is already registered' })
				} else {
				 return new Promise((resolve, reject) => {
						bcrypt.hash(password, 15, (err, hash) => {
							if (err) {
								reject(err)
							} else {
								resolve(hash)
							}
						})
					})
				}
			})
			.then(hash => { User.create({ email, password: hash })})
			.then(() => res.redirect('/login'))
			.catch(err)
	} else {
		res.render('register', { msg: 'Password & password confirmation do not match' })
	}
})

router.post('/logout', (req, res) => {
	req.session.destroy(err => {
		if (err) throw err
		res.redirect('/login')
	})
})

// login guard middleware
router.use((req, res, next) => {
	if (req.session.email) {
		next()
	} else {
		res.redirect('/login')
	}
})

router.get('/order', (req, res, err) => {
	Promise
		.all([
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
		.catch(({ errors })  =>
			Promise.all([ // retrieve sizes and toppings again,
				Promise.resolve(errors), // but pass the errors along as well
				Size.find().sort({ inches: 1 }),
				Toppings.find({type: "meat"}).sort({name: 1}),
				Toppings.find({type: "veggie"}).sort({name: 1})
			])
			.then(([
					errors,
					sizes,
					meats,
					veggies
				]) =>
				// UI/UX additions
				// send errors to renderer to change styling and add error messages
				// also, send the req.body to use as initial form input values
				res.render('order', { page: 'Order', sizes, meats, veggies, errors, body })
			)
			.catch(err)
		)
)

router.get('/thanks', (req, res) => {
	res.render('thanks', {page: 'Thanks'})
})


router.get('/logout', (req, res) => {
	if (req.session.email) {
		res.render('logout', { page: 'Logout'})
	} else {
		res.redirect('/login')
	}
})

module.exports = router;

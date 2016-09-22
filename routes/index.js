'use strict';

const { Router } = require('express');
const router = Router();
// const { db } = require('../database');
const Contact = require('../models/contact');
const Order = require('../models/order');
const Size = require('../models/size');
const Toppings = require('../models/toppings')

const User = require('../models/user')
const bcrypt = require('bcrypt')

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

router.get('/login', (req, res) =>
	res.render('login', {page: 'Login'})
)

router.post('/login', ({ body: { email, password } }, res, err) => {
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
      .then(hash => User.create({ email, password: hash }))
      .then(() => res.redirect('/login'), { msg: 'User created' })
      .catch(err)
  } else {
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})

module.exports = router;

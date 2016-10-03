'use strict';

const { Router } = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');

const router = Router();

router.get('/login', (req, res) =>
	res.render('login', {page: 'Login'})
);

router.post('/login', ({ session, body: { email, password } }, res, err) => {
	User.findOne({ email })
		.then((user) => {
			console.log("user:", user);
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
				.then((matches) => {
					if (matches) {
						session.email = email
						res.redirect('/')
					} else {
						res.render('login', { msg: 'Password does not match', page: 'Login' })
					}
				})
				.catch(err)
			} else {
				res.render('login', { msg: 'Email does not exist in our system', page: 'Login' })
			}
		})
});

module.exports = router;

'use strict';

const Order = require('../models/order');
const Size = require('../models/size');
const Toppings = require('../models/toppings');

module.exports.new = (req, res, err) =>
	Promise
		.all([
			Size.find().sort({inches: 1}),
			Toppings.find({type: "meat"}).sort({name: 1}),
			Toppings.find({type: "veggie"}).sort({name: 1})
		])
		.then(([sizes, meats, veggies]) =>
			res.render('order', { page: 'Order', sizes, meats, veggies}))
		.catch(err)

module.exports.create = (req, res, err) =>
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

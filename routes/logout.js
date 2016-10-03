'use strict';

const { Router } = require('express');

const router = Router();

router.get('/logout', (req, res) => {
	if (req.session.email) {
		res.render('logout', { page: 'Logout'})
	} else {
		res.redirect('/login')
	}
});

router.post('/logout', (req, res) => {
	req.session.destroy(err => {
		if (err) throw err
		res.redirect('/login')
	})
});

module.exports = router;

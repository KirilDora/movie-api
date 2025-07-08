const express = require('express');
const router = express.Router();
const movieController = require('../../../controllers/movies.controller');

router.get('/', movieController.getAllMovies);
router.post('/', movieController.addMovie);

module.exports = router;

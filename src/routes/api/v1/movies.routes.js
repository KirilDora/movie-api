const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../../../middleware/auth.middleware');
const movieController = require('../../../controllers/movies.controller');

router.get('/', auth, movieController.getAllMovies);
router.get('/:id', auth, movieController.getMovieById);
router.post('/', auth, movieController.addMovie);
router.delete('/:id', auth, movieController.deleteMovie);
router.get('/search', auth, movieController.searchMovies);
router.post('/import', auth, upload.single('file'), movieController.importFromTxt);

module.exports = router;

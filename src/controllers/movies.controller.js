const { MoviesService } = require('../services/movies.service');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await MoviesService.getAll(req.query);
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await MoviesService.getById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const result = await MoviesService.add(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const result = await MoviesService.deleteById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    next(error);
  }
};

exports.searchMovies = async (req, res, next) => {
  try {
    const { title, actor } = req.query;
    const results = await MoviesService.search({ title, actor });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.importFromTxt = async (req, res, next) => {
  try {
    const result = await MoviesService.importFromFile(req.file.path);
    res.json({ imported: result.length, movies: result });
  } catch (error) {
    next(error);
  }
};
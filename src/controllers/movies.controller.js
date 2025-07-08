const { MoviesModel } = require('../services/movies.service');

exports.getAllMovies = async (req, res, next) => {
  try {
    const options = {
      sort: req.query.sort || 'title',
      order: req.query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    const movies = await MoviesModel.getAll(options);
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await MoviesModel.getById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const result = await MoviesModel.add(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const result = await MoviesModel.deleteById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    next(error);
  }
};

exports.searchMovies = async (req, res, next) => {
  try {
    const { title, actor } = req.query;
    const results = await MoviesModel.search({ title, actor });
    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.importFromTxt = async (req, res, next) => {
  try {
    const result = await MoviesModel.importFromFile(req.file.path);
    res.json({ imported: result.length, movies: result });
  } catch (error) {
    next(error);
  }
};
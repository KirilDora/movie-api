const sequelize = require('../config/database');
const Movie = require('./movie.model');
const Actor = require('./actor.model');
const MovieActor = require('./movieActor.model');
const User = require('./user.model');

module.exports = { sequelize, Movie, Actor, MovieActor, User };

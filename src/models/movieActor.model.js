const sequelize = require('../config/database');
const Movie = require('./movie.model');
const Actor = require('./actor.model');

const MovieActor = sequelize.define('MovieActor', {}, { timestamps: false });

Movie.belongsToMany(Actor, { through: MovieActor });
Actor.belongsToMany(Movie, { through: MovieActor });

module.exports = MovieActor;

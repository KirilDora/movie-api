const { Movie, Actor } = require('../models');
const fs = require('fs/promises');
const { Op } = require('sequelize');

const MoviesService = {
  async getAll(query) {
    const { order, movieWhere, actorWhere } = this.getOptions(query);

    return await Movie.findAll({
      where: movieWhere,
      include: {
        model: Actor,
        where: actorWhere
      },
      order: [['title', order]]
    });
  },

  getOptions(query) {
    const { order = 'ASC', title, actor } = query;

    const actorWhere = {};
    const movieWhere = {};

    if (title) {
      movieWhere.title = { [Op.like]: `%${title}%` };
    }

    if (actor) {
      actorWhere[Op.or] = [
        { firstName: { [Op.like]: `%${actor}%` } },
        { lastName: { [Op.like]: `%${actor}%` } }
      ];
    }

    return {
      order: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      movieWhere,
      actorWhere: Object.keys(actorWhere).length > 0 ? actorWhere : undefined
    };
  },

  async add({ title, year, format, actors }) {
    if (!title || !year || !format) {
      throw new Error('Missing required fields');
    }

    const movie = await Movie.create({ title, year, format });

    if (Array.isArray(actors)) {
      const actorInstances = await Promise.all(
        actors.map(({ firstName, lastName }) =>
          Actor.findOrCreate({
            where: { firstName, lastName }
          })
        )
      );
      await movie.addActors(actorInstances.map(([actor]) => actor));
    }

    return await Movie.findByPk(movie.id, { include: Actor });
  },

  async getById(id) {
    const movie = await Movie.findByPk(id, { include: Actor });
    return movie;
  },

  async deleteById(id) {
    const movie = await Movie.findByPk(id);
    if (!movie) return null;

    await movie.setActors([]); // delete dependencies many-to-many
    await movie.destroy();
    return true;
  },

  async importFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');

    const blocks = content
                        .split(/\r?\n\s*\r?\n/)
                        .map(block => block.trim())
                        .filter(Boolean);
    const imported = [];

    for (const block of blocks) {
      const lines = block.split('\n').filter(Boolean);

      const movieData = {
        title: '',
        year: null,
        format: '',
        actors: []
      };

      for (const line of lines) {
        const [key, ...rest] = line.split(':');
        const value = rest.join(':').trim();

        if (/^Title$/i.test(key)) movieData.title = value;
        else if (/^Release Year$/i.test(key)) movieData.year = parseInt(value);
        else if (/^Format$/i.test(key)) movieData.format = value;
        else if (/^Stars$/i.test(key)) {
          movieData.actors = value.split(',').map(fullName => {
            const [firstName, ...lastParts] = fullName.trim().split(' ');
            return { firstName, lastName: lastParts.join(' ') };
          });
        }
      }

      // check movie to be unique
      const exists = await Movie.findOne({ where: { title: movieData.title } });
      if (exists) continue;

      try {
        if (!movieData.title || !movieData.year || !movieData.format || !movieData.actors?.length) {
          console.warn('⚠️ Skipping invalid movie:', movieData);
          continue;
        }

        // create movie instance
        const movie = await Movie.create({
          title: movieData.title,
          year: movieData.year,
          format: movieData.format
        });

        // add actors 
        const actorInstances = [];

        for (const { firstName, lastName } of movieData.actors) {
          const [actor] = await Actor.findOrCreate({ where: { firstName, lastName } });
          actorInstances.push(actor);
        }

        await movie.addActors(actorInstances);
        imported.push(movieData.title);
      } catch(err) {
        console.error('❌ Failed to insert movie:', movieData.title, '| Reason:', err.message);
        continue;
      }

    }

    return imported;
  }
};

module.exports = { MoviesService };

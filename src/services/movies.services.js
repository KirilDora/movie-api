const { Movie, Actor } = require('../models');
const fs = require('fs/promises');
const { Op } = require('sequelize');

const MoviesService = {
  async getAll(query) {
    const { sort, order, limit, offset } = this.getOptions(query);
    const validFields = ['title', 'year', 'format'];
    const sortField = validFields.includes(sort) ? sort : 'title';

  return await Movie.findAll({
    include: Actor,
    order: [[sortField, order]],
    limit,
    offset
  });
  },

  getOptions(query) {
    const { sort = 'title', order = 'ASC', limit, offset } = query;

    const validFields = ['title', 'year', 'format'];
    const sortField = validFields.includes(sort) ? sort : 'title';

    return {
      sort: sortField,
      order: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
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

  async search({ title, actor }) {
    const where = {};
    const actorWhere = {};
    //OP is object to create more complex and flexible queries
    if (title) {
      where.title = { [Op.like]: `%${title}%` }; 
    }

    if (actor) {
      actorWhere[Op.or] = [
        { firstName: { [Op.substring]: actor } },
        { lastName: { [Op.substring]: actor } }
      ];
    }

    const results = await Movie.findAll({
      where,
      include: {
        model: Actor,
        where: Object.keys(actorWhere).length ? actorWhere : undefined
      }
    });

    return results;
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

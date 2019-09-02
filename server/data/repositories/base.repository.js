class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  getAll() {
    return this.model.findAll();
  }

  findOne({ where }) {
    return this.model.findOne({ where });
  }

  getById(id) {
    return this.model.findByPk(id);
  }

  create(data) {
    return this.model.create(data);
  }

  async updateById(id, data) {
    try {
      await this.model.update(data, {
        where: { id },
        returning: true,
        plain: true
      });
      return {
        status: true
      };
    } catch (err) {
      return {
        status: false,
        errorMessage: err.message
      };
    }
  }

  deleteById(id) {
    return this.model.destroy({
      where: { id }
    });
  }
}

module.exports = BaseRepository;

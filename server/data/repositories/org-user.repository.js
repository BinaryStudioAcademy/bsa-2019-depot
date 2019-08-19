const BaseRepository = require('./base.repository');
const { OrgUserModel } = require('../models/index');

class OrgUserRepository extends BaseRepository {}

module.exports = new OrgUserRepository(OrgUserModel);

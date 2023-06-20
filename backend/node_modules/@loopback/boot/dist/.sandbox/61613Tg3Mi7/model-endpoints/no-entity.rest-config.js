
const {NoEntity} = require('../models/no-entity.model');
module.exports = {
  // this model extends Model, not Entity
  model: NoEntity,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/no-entities',
};
      
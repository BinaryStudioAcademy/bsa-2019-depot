import Sequelize from 'sequelize';
import * as config from '../../config/db.config';

const sequelize = new Sequelize(config);

export default sequelize;

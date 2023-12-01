import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';

export const Log = sequelize.define('log', {
  id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descricao: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(40)
  }
}, {
  timestamps: true,
  updatedAt: false
});
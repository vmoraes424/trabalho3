import { DataTypes } from "sequelize";
import { sequelize } from "../databases/conecta.js";
import { Usuario } from "./Usuario.js";

export const Pecas = sequelize.define(
  "pecas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    preco: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Peças",
    paranoid: true,
  }
);

Pecas.belongsTo(Usuario, {
  foreignKey: {
    name: "usuario_id",
    allowNull: false,
  },
  onDelete: "Restrict",
  onUpdate: "Cascade",
});

Usuario.hasMany(Pecas, {
  foreignKey: "usuario_id",
});

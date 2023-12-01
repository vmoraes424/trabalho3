import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("trabalho3", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

import { Sequelize } from "sequelize";
import Environment from "../constant/environment";

export let sequelize: Sequelize;

export const ConnectDatabase = async () => {
  sequelize = new Sequelize({
    dialect: "postgres",
    username: Environment.PgUser,
    password: Environment.PgPassword,
    host: Environment.PgHost,
    port: +Environment.PgPort,
    database: Environment.PgDatabase,
  });

  await sequelize
    .authenticate()
    .then(() => console.log("Connected to database"))
    .catch((e) => {
      throw e;
    });
};

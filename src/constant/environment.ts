import dotenv from "dotenv";
dotenv.config();

export type Environment = {
  [key: string]: string;
};

const Environment: Environment = {
  AppPort: process.env.APP_PORT || "3000",
  PgUser: process.env.PG_USER || "",
  PgPassword: process.env.PG_PASSWORD || "",
  PgHost: process.env.PG_HOST || "localhost",
  PgPort: process.env.PG_PORT || "5432",
  PgDatabase: process.env.PG_DATABASE || "postgres",
  Secret: process.env.JWT_SECRECT || "",
  SuperAdminRole: process.env.SUPER_ADMIN_ROLE || "Root"
};

export default Environment;

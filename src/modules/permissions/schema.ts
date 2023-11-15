import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type Permission = {
  id: string;
  name: string;
  description: string;
  policy: string;
  resource: string;
  upstream: string;
  method: string;
};

export class PermissionSchema extends Model<Permission> {}

export const InitPermission = () => {
  PermissionSchema.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      policy: {
        type: DataTypes.STRING,
      },
      resource: {
        type: DataTypes.STRING,
      },
      upstream: {
        type: DataTypes.STRING,
      },
      method: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: sequelize,
      tableName: "permissions",
    }
  );
};

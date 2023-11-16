import { sequelize } from "../../config/database";
import { Permission, PermissionSchema } from "./schema";
export class PermissionService {
  static async getAll() {
    return PermissionSchema.findAll();
  }

  static async getPermissionOfRole(roleId: string): Promise<Array<Permission>> {
    const permissions = await sequelize.query(`
      select p.* as permissions from roles
        left join role_permissions as rp on rp.role_id = roles.id
        left join permissions as p on p.id = rp.permission_id 
      where roles.id = ${roleId}
    `);

    return permissions[0] as Array<Permission>;
  }
}

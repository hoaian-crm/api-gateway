import { PermissionSchema } from "./schema";
export class PermissionService {
  static async getAll() {
    return PermissionSchema.findAll();
  }
}

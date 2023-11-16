import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Environment from "../../constant/environment";
import { PermissionService } from "../permissions/service";
import { PermissionSchema } from "../permissions/schema";

export const Authorization = (policy: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (policy === "public") {
        return next();
      }
      const headers = req.headers;
      const token = headers["authorization"]?.split(" ")[1];

      if (!token) {
        res.status(401).send("Unauthorized");
        return;
      }

      const user: any = jwt.verify(token, Environment.Secret);

      req.headers["UserId"] = user.id;
      const permissions = await PermissionService.getPermissionOfRole(
        user.role.id
      );
      console.log("permissions is: ", user);
      if (
        user.role?.name == Environment.SuperAdminRole ||
        permissions.map((p) => p.policy).includes(policy)
      ) {
        return next();
      }
      res.status(403).send("Forbidden Resource");
    } catch (error) {
      console.log("error is", error);
      res.status(401).send("Unauthorized");
    }
  };
};

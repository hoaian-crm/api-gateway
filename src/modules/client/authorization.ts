import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Environment from "../../constant/environment";

export const Authorization = (policy: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
      if (user.role?.name == Environment.SuperAdminRole) {
        return next();
      }
      res.status(401).send("Unauthorized");
    } catch (error) {
      console.log("error is", error);
      res.status(401).send("Unauthorized");
    }
  };
};

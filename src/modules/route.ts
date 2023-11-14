import { Express, Request, Response } from "express";
import { PermissionService } from "./permissions/service";
import { InitPermission, Method, PermissionSchema } from "./permissions/schema";
import Environment from "../constant/environment";

export const InitRoute = async (app: Express) => {
  InitPermission();
  const permissions = await PermissionSchema.findAll();
  permissions.map((permission) => {
    const route = permission.dataValues.resource;
    const method = permission.dataValues.method;
    const upstreamHost = Environment[permission.dataValues.upstream];
    if (route && upstreamHost) {
      switch (method) {
        case Method.GET:
          app.get(route, (request: Request, response: Response) => {
            response.redirect(upstreamHost + request.url);
          });
        case Method.POST:
          app.post(route, (request: Request, response: Response) => {
            response.redirect(upstreamHost + request.url);
          });
        case Method.PUT:
          app.put(route, (request: Request, response: Response) => {
            response.redirect(upstreamHost + request.url);
          });
        case Method.PATCH:
          app.patch(route, (request: Request, response: Response) => {
            response.redirect(upstreamHost + request.url);
          });
      }
      console.log(`[${method}] ${route}`);
    }
  });
};

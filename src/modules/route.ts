import { Express, Request, Response } from "express";
import { PermissionService } from "./permissions/service";
import { InitPermission, Method, PermissionSchema } from "./permissions/schema";
import Environment from "../constant/environment";
import { AxiosResponse, AxiosError } from "axios";
import { CreateClient } from "./client";
import { Authorization } from "./client/authorization";

export const InitRoute = async (app: Express) => {
  InitPermission();
  let permissions = await PermissionSchema.findAll();

  permissions.map((permission: PermissionSchema) => {
    const route = permission.dataValues.resource;
    const method = permission.dataValues.method;
    const policy = permission.dataValues.policy;
    const upstreamHost = Environment[permission.dataValues.upstream];
    if (route && upstreamHost) {
      switch (method) {
        case Method.GET:
          app.get(
            route,
            Authorization(policy),
            async (req: Request, res: Response) => {
              const proxyUrl = upstreamHost + req.url;
              const client = CreateClient(req, res);
              await client.get(proxyUrl);
            }
          );
        case Method.POST:
          app.post(
            route,
            Authorization(policy),
            async (req: Request, res: Response) => {
              const proxyUrl = upstreamHost + req.url;
              const client = CreateClient(req, res);
              await client.post(proxyUrl, req.body);
            }
          );
        case Method.PUT:
          app.put(
            route,
            Authorization(policy),
            (req: Request, res: Response) => {
              const proxyUrl = upstreamHost + req.url;
              const client = CreateClient(req, res);
              client.put(proxyUrl, req.body);
            }
          );
        case Method.PATCH:
          app.patch(
            route,
            Authorization(policy),
            (req: Request, res: Response) => {
              const proxyUrl = upstreamHost + req.url;
              const client = CreateClient(req, res);
              client.patch(proxyUrl, req.body);
            }
          );
        case Method.DELETE:
          app.delete(
            route,
            Authorization(policy),
            async (req: Request, res: Response) => {
              const proxyUrl = upstreamHost + req.url;
              const client = CreateClient(req, res);
              await client.delete(proxyUrl);
            }
          );
      }
      console.log(`[${method}] ${route}`);
    }
  });
};

import { HttpStatusCode } from "./../../node_modules/axios/index.d";
import { Express, Request, Response } from "express";
import { PermissionService } from "./permissions/service";
import { InitPermission, Method, PermissionSchema } from "./permissions/schema";
import Environment from "../constant/environment";
import { AxiosResponse } from "axios";
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
              try {
                const proxyUrl = upstreamHost + req.url;
                const client = CreateClient(req, res);
                await client.get(proxyUrl);
              } catch (error) {}
            }
          );
        case Method.POST:
          app.post(
            route,
            Authorization(policy),
            async (req: Request, res: Response) => {
              try {
                const proxyUrl = upstreamHost + req.url;
                const client = CreateClient(req, res);
                await client.post(proxyUrl, req.body);
              } catch (error) {}
            }
          );
        case Method.PUT:
          app.put(
            route,
            Authorization(policy),
            (req: Request, res: Response) => {
              try {
                const proxyUrl = upstreamHost + req.url;
                const client = CreateClient(req, res);
                client.put(proxyUrl, req.body);
              } catch (error) {}
            }
          );
        case Method.PATCH:
          app.patch(
            route,
            Authorization(policy),
            (req: Request, res: Response) => {
              try {
                const proxyUrl = upstreamHost + req.url;
                const client = CreateClient(req, res);
                client.patch(proxyUrl, req.body);
              } catch (error) {}
            }
          );
        case Method.DELETE:
          app.delete(
            route,
            Authorization(policy),
            (req: Request, res: Response) => {
              try {
                const proxyUrl = upstreamHost + req.url;
                const client = CreateClient(req, res);
                client.delete(proxyUrl);
              } catch (error) {}
            }
          );
      }
      console.log(`[${method}] ${route}`);
    }
  });

  app.get("/soft-deploy", async (req, res) => {
    permissions = await PermissionSchema.findAll();
    res.send("Nice");
  });
};

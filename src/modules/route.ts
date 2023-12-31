import { Express, Request, Response } from "express";
import { CreateClient } from "./client";
import { Authorization } from "./client/authorization";
import { handleMultipartFromData } from "./client/multipart";
import { InitPermission, Method, PermissionSchema } from "./permissions/schema";

export const InitRoute = async (app: Express) => {
  InitPermission();
  let permissions = await PermissionSchema.findAll();

  permissions.map((permission: PermissionSchema) => {
    const route = permission.dataValues.resource;
    const method = permission.dataValues.method;
    const policy = permission.dataValues.policy;
    const upstreamHost = process.env[permission.dataValues.upstream];
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
              if (req.headers["content-type"] !== "application/json") {
                await client.post(proxyUrl, handleMultipartFromData(req), {
                  headers: {
                    "Content-Type": req.headers["content-type"],
                  },
                });
                return;
              }
              await client.post(proxyUrl, req.body, {
                headers: {
                  "Content-Type": req.headers["content-type"],
                },
              });
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
              await client.delete(proxyUrl, {params: req.query, data: req.body});
            }
          );
      }
      console.log(`[${method}] ${route}`);
    }
  });
};

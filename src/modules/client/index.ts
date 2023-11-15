import axios, { AxiosError, AxiosResponse } from "axios";
import { Response, Request } from "express";

export const CreateClient = (req: Request, res: Response) => {
  const client = axios.create();

  client.interceptors.request.use(function (request) {
    return request;
  });

  client.interceptors.response.use(
    function (response: AxiosResponse) {
      res.status(response.status).send(response.data);
      return response;
    },
    function (error: AxiosError) {
      res.status(error.response!.status).send(error.response?.data);
      return error;
    }
  );
  return client;
};

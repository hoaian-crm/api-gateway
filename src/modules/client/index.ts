import axios, { AxiosError, AxiosResponse } from "axios";
import { Request, Response } from "express";

export const CreateClient = (req: Request, res: Response) => {
  const client = axios.create({
    timeout: 2000
  });

  client.interceptors.request.use(function (request) {
    request.headers["UserId"] = req.headers["UserId"];
    return request;
  });

  client.interceptors.response.use(
    function (response: AxiosResponse) {
      res.status(response.status).send(response.data);
      return response;
    },
    function (error: AxiosError) {
      if(error.response) {
        res.status(error.response!.status || 500).send(error.response?.data);
        return error;
      }
      res.status(500).send(error.message);
      return error;
    }
  );
  return client;
};

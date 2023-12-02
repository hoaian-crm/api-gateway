import { Request } from "express";
import FormData from "form-data";

export const handleMultipartFromData = (req: Request) => {
  const result = new FormData();
  if (req.body) {
    Object.keys(req.body).forEach((value) => {
      result.append(value, req.body[value]);
    });
  }
  if (req.files) {
    const files = req.files as Array<Express.Multer.File>;
    files.map((file) => {
      result.append(file.fieldname, file.buffer, file.originalname);
    });
  }
  return result;
};

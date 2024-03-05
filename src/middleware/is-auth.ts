import * as jwt from "jsonwebtoken";
import HttpError from "../utils/errorHandler";

export default (req: any, res: any, next: any) => {
  const authHeader: string | undefined = req.get("Authorization");
  if (!authHeader) {
    return next(new HttpError("Not Authenticated!", 401));
  }
  const token: string = authHeader.split(" ")[1];
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "secret123");
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    return next(new HttpError("Not Authenticated!", 401));
  }
  req.userId = decodedToken.userId;
  next();
};

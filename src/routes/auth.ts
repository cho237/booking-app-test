import { Router } from "express";
import { IUser, User } from "../models/model";
import * as jwt from "jsonwebtoken";
import HttpError from "../utils/errorHandler";

const router = Router();

let users: IUser[] = [
  {
    id: "13231",
    email: "ivan.donfack@yahoo.fr",
    password: "12345678",
  },
  {
    id: "1323ds1",
    email: "t@gmail.com",
    password: "12345678",
  },
];

type loginReqBody = {
  email: string;
  password: string;
};

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body as loginReqBody;
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return next(new HttpError("user_not_found", 404));
    }
    if (user.password !== body.password) {
      return next(new HttpError("wrong_password", 401));
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      "secret123",
      { expiresIn: "1h" }
    );
    
    const resUser = {
      id: user._id,
      email: user.email,
      expiresIn: "3600",
      idToken: token,
    };

    res.status(201).json(resUser);
  } catch (err: any) {
    return next(new HttpError(err, 500));
  }
});

router.post("/signup", async (req, res, next) => {
  const body = req.body as loginReqBody;
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return next(new HttpError("email_exist", 401));
  }
  if (body.password.length < 5) {
    return next(new HttpError("weak_password", 403));
  }
  const user = new User({
    email: body.email,
    password: body.password,
  });
  const newUser = await user.save();
  const token = jwt.sign(
    {
      email: newUser.email,
      userId: newUser.id,
    },
    "secret123",
    { expiresIn: "1h" }
  );
  const resUser = {
    id: newUser._id,
    email: newUser.email,
    expiresIn: "3600",
    idToken: token,
  };
  res.status(201).json(resUser);
});

export default router;

import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.send("Hello World");
};

export const updateUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "UnauthorizedAccess!! You can update only your own profile"
      )
    );
  }

  try {
    if (req.body.password) {
      const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "UnauthorizedAccess!! You can delete only your own profile"
      )
    );
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

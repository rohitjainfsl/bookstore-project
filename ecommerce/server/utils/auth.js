import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; //we are attaching the user's document to the incoming request
    next(); //calling the next function in line
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

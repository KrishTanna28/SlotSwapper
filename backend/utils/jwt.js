import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  if (!token) throw new Error("Missing token");
  return jwt.verify(token, process.env.JWT_SECRET);
};
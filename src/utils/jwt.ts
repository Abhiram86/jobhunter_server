import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const decode = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateToken = (
  userId: string,
  role: "client" | "freelancer" | "admin"
) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};

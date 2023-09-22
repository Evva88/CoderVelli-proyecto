import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const CARAMELO_DE_LIMON = process.env.CARAMELO_DE_LIMON;
export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;


console.log("PORT:", PORT);
console.log("CARAMELO_DE_LIMON");


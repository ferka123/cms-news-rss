import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const verifyPassword = async (hash: string, password: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};

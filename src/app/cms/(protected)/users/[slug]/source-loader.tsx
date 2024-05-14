import { getUserFormById } from "@/lib/user/queries";
import { UserForm } from "@/lib/user/schema";

const defaultData: UserForm = {
  name: "",
  password: "",
  email: "",
  role: "author",
  state: "active",
};

export const sourceLoader = async (slug: string) => {
  const data = slug === "create" ? defaultData : await getUserFormById(slug);
  return data;
};

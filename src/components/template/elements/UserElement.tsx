import { type User } from "@prisma/client";
import { type DynamicDataElementProps } from "./DynamicDataElement";

function UserElement({ data: user }: DynamicDataElementProps<User>) {
  return <div>User name: {user.name}</div>;
}

export default UserElement;

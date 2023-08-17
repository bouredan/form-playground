import { type RegistryFieldsType } from "@rjsf/utils";
import { ImageBlock } from "./ImageBlock";
import { UserBlock } from "./UserBlock";

export const customFields: RegistryFieldsType = {
  ImageField: ImageBlock,
  UserField: UserBlock,
};

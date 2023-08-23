import { type Address } from "@prisma/client";
import { type DynamicDataElementProps } from "./DynamicDataElement";

export function AddressElement({
  data: address,
}: DynamicDataElementProps<Address>) {
  return (
    <div>
      City: {address.city}
      <br />
      Street: {address.street}
      <br />
    </div>
  );
}

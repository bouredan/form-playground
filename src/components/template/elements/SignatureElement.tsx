import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "~/components/ui/button";

export interface SignatureElementProps {
  onSubmit: (dataURL: string) => void;
}

export function SignatureElement({ onSubmit }: SignatureElementProps) {
  const ref = useRef<SignatureCanvas>(null);
  return (
    <div>
      Sign here
      <SignatureCanvas
        ref={ref}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: "border border-black-200",
        }}
      />
      <Button
        onClick={() => {
          const dataURL = ref.current?.getSignaturePad().toDataURL();
          console.log(dataURL);
          if (dataURL) {
            onSubmit(dataURL);
          }
        }}
      >
        save
      </Button>
    </div>
  );
}

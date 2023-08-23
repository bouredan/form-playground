import SignatureCanvas from "react-signature-canvas";

export function SignatureElement() {
  return (
    <div>
      Sign here
      <SignatureCanvas
        penColor="red"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas border border-red-200" }}
      />
    </div>
  );
}

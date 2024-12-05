import { TriangleIcon } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{message}</p>
    </div>
  );
}

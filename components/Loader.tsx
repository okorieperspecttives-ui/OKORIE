import { LucideLoader2 } from "lucide-react";

const Loader = ({ size }: { size: number }) => {
  return (
    <div>
      <LucideLoader2 className="animate-spin" size={size} />
    </div>
  );
};

export default Loader;

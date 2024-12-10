import { cn } from "../../src/lib/utils";
const Icon = ({ icon: Icon, size, className }) => {
  return <Icon size={size ? size : 22} className={cn(className)} />;
};

export default Icon;

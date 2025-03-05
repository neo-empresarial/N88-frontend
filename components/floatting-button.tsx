import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FloattingButtonProps {
  icon: React.ReactNode;
  content: React.ReactNode;
}

function FloattingButton({ icon, content }: FloattingButtonProps) {
  return (
    <div className="absolute bottom-10 right-10">
      <Popover>
        <PopoverTrigger>
          <Badge className="p-2 rounded-full">{icon}</Badge>
        </PopoverTrigger>
        <PopoverContent>{content}</PopoverContent>
      </Popover>
    </div>
  );
}

export default FloattingButton;

import { createAvatar } from "@dicebear/avatars";
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant?: "botttsNeutral" | "initials";
}
export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  let avatar;
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral as any, {
      seed,
    });
  } else {
    avatar = createAvatar(initials as any, {
      seed,
      fontWeight: 500,
      fontSize: 40,
    });
  }

  return (
    <Avatar className={cn("w-10 h-10", className)}>
      <AvatarImage src={avatar} alt="Generated Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

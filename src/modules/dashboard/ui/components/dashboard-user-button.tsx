import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const { data, isPending } = authClient.useSession();
  const isMobile = useIsMobile();
  const router = useRouter();
  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: ({ error }) => console.error("Error signing out:", error),
      },
    });
  };
  if (isPending || !data?.user) {
    return <div>Loading...</div>;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="items-center  justify-between bg-white/5 hover:bg-white/10 p-3 w-full py-2 rounded-lg border-border/10 cursor-pointer overflow-hidden flex">
          {data.user.image ? (
            <Avatar>
              <AvatarImage
                src={data.user.image}
                alt={data.user.name || "User Avatar"}
              />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name || "U"}
              variant="initials"
              className="size-9 mr-3"
            />
          )}
          <div className="flex flex-col gap-0.5 text-left oveflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">
              {data.user.name || "User"}
            </p>
            <p className="text-xs truncate w-full">
              {data.user.email || "No email"}
            </p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={() => {}}>
              <CreditCardIcon className="size-4 mr-2" />
              Billing
            </Button>
            <Button variant="ghost" onClick={onLogout}>
              <LogOutIcon className="size-4 mr-2" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="items-center  justify-between bg-white/5 hover:bg-white/10 p-3 w-full py-2 rounded-lg border-border/10 cursor-pointer overflow-hidden flex">
        {data.user.image ? (
          <Avatar>
            <AvatarImage
              src={data.user.image}
              alt={data.user.name || "User Avatar"}
            />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name || "U"}
            variant="initials"
            className="size-9 mr-3"
          />
        )}
        <div className="flex flex-col gap-0.5 text-left oveflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{data.user.name || "User"}</p>
          <p className="text-xs truncate w-full">
            {data.user.email || "No email"}
          </p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <p className="font-medium truncate">{data.user.name || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {data.user.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between"
        >
          Logout
          <LogOutIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { SidebarLeftIcon } from "./icons";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="outline"
      className="bg-background border border-gray text-gray-600 hover:white dark:text-gray-200 h-10"
      onClick={toggleSidebar}
    >
      <SidebarLeftIcon />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

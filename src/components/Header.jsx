/* eslint-disable no-unused-vars */
import { Button } from "/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import NotificationDropdown from "./NotificationDropdown";

function Header() {
  // We can store this in our global state
  const [userData, setUserData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUserData(data?.session?.user);
    };
    getUserData();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();

      toast.success("Signed out successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <header className="bg-transparent p-2 flex justify-end items-center">
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          {/* <NotificationDropdown /> */}
          <Bell />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-2 py-1.5 h-auto "
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="JDK" />
                  <AvatarFallback className="text-black">
                    {/* {userData?.email?.split("@")[0].slice(0, 2).toUpperCase()} */}
                    JDK
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold ">
                    {/* {userData?.email
                      .split("@gmail.com")
                      .join()
                      .replace(",", "")} */}
                    Admin
                  </span>

                  <span className="text-sm text-black uppercase">
                    {userData?.user_metadata?.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;

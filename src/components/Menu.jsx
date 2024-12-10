/* eslint-disable no-unused-vars */
import {
  ClipboardList,
  Clock,
  FileSignature,
  FileText,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";

import SideBar from "./SideBar";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

const Menu = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUserData(data?.session?.user);
    };
    getUserData();
  }, []);

  const role = userData?.user_metadata?.role;

  const menuItems = [
    {
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutGrid,
          visible: ["admin"],
        },
        {
          label: "Programs & Directorates",
          href: "/dashboard/program-directorates",
          icon: ClipboardList,
          visible: ["admin"],
        },
        {
          label: "Policies",
          href: "/dashboard/policies",
          icon: FileSignature,
          visible: ["admin", "secretary"],
        },
        {
          icon: Settings,
          label: "Settings",
          href: "/dashboard/settings",
          visible: ["admin", "secretary"],
        },
      ],
    },
  ];

  const isVisible = (item) => {
    if (!item.visible) {
      return true;
    }
    return item.visible.includes(role);
  };

  return (
    <div className="mt-4 text-sm SS">
      {menuItems.map((section, index) => (
        <div className="flex flex-col gap-2" key={index - index}>
          {section.items.map(
            (item) =>
              isVisible(item) && (
                <SideBar
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;

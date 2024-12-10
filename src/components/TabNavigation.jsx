/* eslint-disable react/prop-types */
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

export function TabNavigation({
  items,
  defaultValue = items[0]?.value,
  basePath,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the active tab from the current URL
  const activeTab = location.pathname.startsWith(basePath)
    ? location.pathname.replace(`${basePath}/`, "")
    : defaultValue; // Fallback to defaultValue if no matching path

  return (
    <Tabs
      defaultValue={defaultValue} // Set the default tab on initial render
      value={defaultValue || activeTab} // Keep active tab in sync with the current route
      className="w-full"
    >
      <TabsList className="flex justify-start h-auto p-0 bg-transparent space-x-2">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value} // Each tab's unique value
            onClick={() => navigate(`${basePath}/${item.value}`)} // Navigate to the respective route
            className="data-[state=active]:bg-[#008080] border-2 border-gray-200 text-[#008080] data-[state=active]:text-white rounded-md py-2 px-2 bg-white hover:bg-[#edf4f5]"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Bell, Check, Circle } from "lucide-react";
// import { cn, formatDateToReadableString } from "@/lib/utils";
// // import { useData } from "../hooks/useData";
// import { toast } from "react-toastify";
// import { supabase } from "../services/supabase";

// const NotificationDropdown = () => {
//   const {
//     data: { notifications, staffs },
//     refresh,
//   } = useData();
//   const [userData, setUserData] = useState();

//   useEffect(() => {
//     const getUserData = async () => {
//       const { data, error } = await supabase.auth.getSession();
//       if (data?.session?.user) {
//         setUserData(data.session.user);
//       }
//     };
//     getUserData();
//   }, []);

//   const StaffData = userData
//     ? staffs.find((staff) => staff.email === userData.email)
//     : [];

//   // Filter notifications to show only if user ID is present in notifications.staffs
//   const filteredNotifications = notifications.filter(
//     (notif) => notif.staffs && notif.staffs.includes(StaffData?.id)
//   );

//   const unreadCount = filteredNotifications.filter(
//     (notif) => notif.status === "unread"
//   ).length;

//   const handleMarkAsRead = async (e, notificationId) => {
//     e.preventDefault();
//     e.stopPropagation();
//     try {
//       const { data: updatedData, error: updateError } = await supabase
//         .from("notifications")
//         .update({ status: "read" })
//         .eq("id", notificationId);

//       await refresh();
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       toast.error("Failed to update notification");
//     }
//   };

//   const handleNotificationClick = (link) => {
//     window.location.href = link;
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative h-12 w-12 bg-gray-100 rounded-xl"
//         >
//           <Bell className="h-5 w-5 text-black" />
//           {unreadCount > 0 && (
//             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
//           )}
//           <span className="sr-only">Notifications</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <div className="flex items-center justify-between px-4 py-2 font-medium">
//           <span>Notifications</span>
//           {unreadCount > 0 && (
//             <span className="text-xs text-muted-foreground">
//               {unreadCount} unread
//             </span>
//           )}
//         </div>
//         <DropdownMenuSeparator />
//         {filteredNotifications.length === 0 ? (
//           <div className="py-4 px-4 text-center text-muted-foreground">
//             No notifications
//           </div>
//         ) : (
//           <div className="max-h-[300px] overflow-y-auto">
//             {filteredNotifications.map((notification) => (
//               <DropdownMenuItem
//                 key={notification.id}
//                 className={cn(
//                   "flex items-start gap-4 p-4 cursor-pointer border-b mb-2",
//                   notification.status === "unread" && "bg-gray-50"
//                 )}
//                 onClick={() => handleNotificationClick(notification.link)}
//               >
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center justify-between">
//                     <p
//                       className={cn(
//                         "text-md font-medium overflow-hidden text-ellipsis whitespace-nowrap",
//                         notification.status === "unread" && "font-semibold"
//                       )}
//                       style={{
//                         overflowWrap: "break-word",
//                         wordBreak: "break-word",
//                       }}
//                       title={notification.title} // Tooltip for full text
//                     >
//                       {notification.title}
//                     </p>

//                     <button
//                       onClick={(e) => handleMarkAsRead(e, notification.id)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       {notification.status === "read" ? (
//                         <Check className="h-4 w-4" />
//                       ) : (
//                         <Circle className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                   <p
//                     className="text-sm text-gray-500 line-clamp-3 overflow-hidden"
//                     style={{
//                       overflowWrap: "break-word",
//                       wordBreak: "break-word",
//                     }}
//                   >
//                     {notification.summary_message}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {formatDateToReadableString(notification.created_at)}
//                   </p>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export default NotificationDropdown;

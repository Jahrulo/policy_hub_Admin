import React from "react";

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild = false,
}) => {
  const handleClick = () => {
    // window.location.href = "/auth/login";
  };

  return (
    <span className="cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  );
};

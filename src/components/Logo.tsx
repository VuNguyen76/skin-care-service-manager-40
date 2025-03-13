
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  color?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", color = "text-primary", showIcon = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      {showIcon && <Sparkles className={`${color}`} />}
      <span className={`font-bold tracking-tight ${color} ${sizeClasses[size]}`}>
        BEAUTYCARE
      </span>
    </Link>
  );
};

export default Logo;

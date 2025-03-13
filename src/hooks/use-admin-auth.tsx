
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      const user = localStorage.getItem("user");
      
      if (!user) {
        toast.error("You must be logged in to access admin area");
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(user);
        const userRoles = userData.roles || [];
        
        if (userRoles.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        } else {
          toast.error("You don't have permission to access admin area");
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Authentication error");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  return { isLoading, isAdmin };
}

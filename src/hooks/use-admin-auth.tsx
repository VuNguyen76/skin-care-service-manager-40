
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }
        
        const hasAdminRole = user.roles && 
          (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ADMIN"));
          
        if (!hasAdminRole) {
          toast.error("You don't have permission to access this page");
          navigate("/", { replace: true });
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  return { isAdmin, isLoading };
};

export default useAdminAuth;

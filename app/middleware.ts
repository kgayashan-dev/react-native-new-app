import { useEffect } from "react";
import { useRouter } from "expo-router";
import authUtils from "../app/utils/authUtils"; // Import correctly

export default function middlware() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authUtils.getUserToken();
      if (!token) {
        router.replace("/"); // Redirect if no token
      }
    };

    checkAuth();
  }, []);

  return null; // No UI needed
}

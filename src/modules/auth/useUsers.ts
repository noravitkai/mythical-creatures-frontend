import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { User } from "../../interfaces/interfaces";

// Reactive variables
const token = ref<string | null>(localStorage.getItem("lsToken"));
const error = ref<string | null>(null);
const user = ref<User | null>(null);
const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

const isLoggedIn = computed(() => !!token.value);

export const useUsers = () => {
  const router = useRouter();

  // Fetch token with details
  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("lsToken") || "",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse.error || "Error");
        throw new Error("No data available");
      }

      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      localStorage.setItem("lsToken", authResponse.data.token);
      localStorage.setItem("userIdToken", authResponse.data.userId);
      console.log("User logged in successfully", authResponse);
      console.log("Token:", token.value);

      // Redirect to the dashboard upon successful login
      router.push("/dashboard");
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
    }
  };

  // Register a new user
  const registerUser = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("No data available");
      }

      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      localStorage.setItem("lsToken", authResponse.data.token);
      console.log("User is registered successfully", authResponse);
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
    }
  };

  // Log the user out
  const logoutUser = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("lsToken");
    console.log("User logged out successfully");
    router.push("/login");
  };

  return {
    token,
    isLoggedIn,
    error,
    user,
    username,
    email,
    password,
    fetchToken,
    registerUser,
    logoutUser,
  };
};

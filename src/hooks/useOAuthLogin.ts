import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { patientService } from "@/services/patient.service";
import { useAuthStore } from "@/store/auth.store";

export function useOAuthLogin() {
  const router = useRouter();
  const { setAuth, setHasProfile } = useAuthStore();

  const handleOAuthResponse = async (
    provider: "google" | "apple",
    idToken: string
  ) => {
    const response =
      provider === "google"
        ? await authService.loginWithGoogle({ idToken })
        : await authService.loginWithApple({ idToken });

    setAuth(response);

    if (response.user.role !== "Patient") {
      toast.success("Welcome!");
      router.push("/dashboard");
      return;
    }

    try {
      await patientService.getProfile();
      setHasProfile(true);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      setHasProfile(false);
      toast.success("Signed in! Let's complete your profile.");
      router.push("/onboarding");
    }
  };

  return { handleOAuthResponse };
}

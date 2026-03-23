"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import UniHealthLogo from "@/components/UniHealthLogo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { patientService } from "@/services/patient.service";
import { hospitalService } from "@/services/hospital.service";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function EmailLoginPage() {
  const router = useRouter();
  const { setAuth, setHasProfile } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await authService.login(data);
      setAuth(response);

      // Set cookie for middleware
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400`;

      // Hospital role — check if facility profile exists
      if (response.user.role === "Hospital") {
        try {
          await hospitalService.getMyHospital();
          toast.success("Welcome back!");
          router.push("/dashboard");
        } catch {
          toast.success("Logged in! Let's set up your facility profile.");
          router.push("/hospital-onboarding");
        }
        return;
      }

      // Other non-patient roles go straight to dashboard
      if (response.user.role !== "Patient") {
        toast.success("Welcome back!");
        router.push("/dashboard");
        return;
      }

      // Check if patient has a profile
      try {
        await patientService.getProfile();
        setHasProfile(true);
        toast.success("Welcome back!");
        router.push("/dashboard");
      } catch {
        // No profile yet — redirect to onboarding
        setHasProfile(false);
        toast.success("Logged in! Let's complete your profile.");
        router.push("/onboarding");
      }
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid email or password. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #166534 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #15803d 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <UniHealthLogo size="md" showText={true} />
        </div>

        {/* Card */}
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-[#4ade80] transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              size="lg"
              className="mt-2"
            >
              Log In
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#4ade80] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              ← Back to login options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

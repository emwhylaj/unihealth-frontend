"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import UniHealthLogo from "@/components/UniHealthLogo";
import Button from "@/components/ui/Button";
import { patientService } from "@/services/patient.service";
import { useAuthStore } from "@/store/auth.store";

const bloodGroupMap: Record<string, string> = {
  "A+": "APositive",
  "A-": "ANegative",
  "B+": "BPositive",
  "B-": "BNegative",
  "AB+": "ABPositive",
  "AB-": "ABNegative",
  "O+": "OPositive",
  "O-": "ONegative",
};

const schema = z.object({
  lastName: z.string().min(1, "Surname is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender",
  }),
  address: z.string().optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], {
    required_error: "Please select a marital status",
  }),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  healthConditions: z.string().optional(),
  medications: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized   = useAuthStore((s) => s.isInitialized);
  const setHasProfile   = useAuthStore((s) => s.setHasProfile);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      maritalStatus: "Single",
      gender: "Male",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const allergiesArr = data.allergies
        ? data.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const conditionsArr = data.healthConditions
        ? data.healthConditions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const medicationsArr = data.medications
        ? data.medications
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await patientService.createProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || undefined,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        bloodGroup: data.bloodGroup ? bloodGroupMap[data.bloodGroup] : undefined,
        address: data.address || undefined,
        allergies: allergiesArr.length > 0 ? allergiesArr : undefined,
        healthConditions: conditionsArr.length > 0 ? conditionsArr : undefined,
        medications: medicationsArr.length > 0 ? medicationsArr : undefined,
      });

      setHasProfile(true);
      toast.success("Profile created! Welcome to UniHealth.");
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to save profile. Please try again.";
      toast.error(msg);
    }
  };

  const inputClass =
    "w-full bg-[#1a2a1a] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-[#4ade80] placeholder:text-gray-500 transition-all";

  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <div className="min-h-screen bg-[#0a0f0a] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #166534 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #15803d 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center py-6 border-b border-[#1a2a1a]">
        <UniHealthLogo size="sm" showText={true} />
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-400">
            Help us personalise your health experience. This information is
            securely stored.
          </p>
        </div>

        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Row */}
            <div>
              <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>
                    Surname <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`${inputClass} ${errors.lastName ? "border-red-500" : ""}`}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className={errorClass}>{errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className={`${inputClass} ${errors.firstName ? "border-red-500" : ""}`}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className={errorClass}>{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Other Name</label>
                  <input
                    type="text"
                    placeholder="Middle name"
                    className={inputClass}
                    {...register("middleName")}
                  />
                </div>
              </div>
            </div>

            {/* DOB + Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className={`${inputClass} ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className={errorClass}>{errors.dateOfBirth.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  className={`${inputClass} ${errors.gender ? "border-red-500" : ""}`}
                  {...register("gender")}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className={errorClass}>{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* House Address */}
            <div>
              <label className={labelClass}>House Address</label>
              <input
                type="text"
                placeholder="123 Main Street, Lagos, Nigeria"
                className={inputClass}
                {...register("address")}
              />
            </div>

            {/* Marital Status + Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Marital Status <span className="text-red-400">*</span>
                </label>
                <select
                  className={`${inputClass} ${errors.maritalStatus ? "border-red-500" : ""}`}
                  {...register("maritalStatus")}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {errors.maritalStatus && (
                  <p className={errorClass}>{errors.maritalStatus.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Blood Group</label>
                <select className={inputClass} {...register("bloodGroup")}>
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Health Section */}
            <div>
              <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-4">
                Health Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Allergies{" "}
                    <span className="text-gray-500 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts, Dust"
                    className={inputClass}
                    {...register("allergies")}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Health Conditions{" "}
                    <span className="text-gray-500 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Diabetes"
                    className={inputClass}
                    {...register("healthConditions")}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Current Medications{" "}
                    <span className="text-gray-500 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                    className={inputClass}
                    {...register("medications")}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              size="lg"
              className="mt-2"
            >
              Save Profile & Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

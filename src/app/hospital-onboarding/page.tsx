"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import UniHealthLogo from "@/components/UniHealthLogo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { hospitalService, type HospitalType } from "@/services/hospital.service";

const HOSPITAL_TYPES: { value: HospitalType; label: string }[] = [
  { value: "General", label: "General Hospital" },
  { value: "Teaching", label: "Teaching Hospital" },
  { value: "Specialist", label: "Specialist Hospital" },
  { value: "Clinic", label: "Clinic" },
  { value: "Pharmacy", label: "Pharmacy" },
];

const schema = z.object({
  name: z.string().min(2, "Facility name is required"),
  type: z.enum(["General", "Teaching", "Specialist", "Clinic", "Pharmacy"] as const),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s\-()]{7,15}$/.test(val),
      "Please enter a valid phone number"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Please enter a valid email"
    ),
});

type FormData = z.infer<typeof schema>;

export default function HospitalOnboardingPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "General" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await hospitalService.registerHospital({
        name: data.name,
        type: data.type,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
      });

      toast.success("Facility profile created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create facility profile. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-6 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <UniHealthLogo size="md" showText={true} />
        </div>

        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Set up your facility
            </h1>
            <p className="text-gray-400 text-sm">
              Tell us about your medical facility to get started
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1 bg-[#4ade80] rounded-full" />
            <div className="flex-1 h-1 bg-[#4ade80] rounded-full" />
            <div className="flex-1 h-1 bg-[#1a3a1a] rounded-full" />
          </div>
          <p className="text-xs text-gray-500 mb-6">Step 2 of 3 — Facility details</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Facility Name *"
              type="text"
              placeholder="e.g. Lagos General Hospital"
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Facility Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Facility Type *
              </label>
              <select
                {...register("type")}
                className="w-full bg-[#0f1a0f] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 appearance-none"
              >
                {HOSPITAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            <Input
              label="Address"
              type="text"
              placeholder="Street address"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                type="text"
                placeholder="Lagos"
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="State"
                type="text"
                placeholder="Lagos State"
                error={errors.state?.message}
                {...register("state")}
              />
            </div>

            <Input
              label="Country"
              type="text"
              placeholder="Nigeria"
              error={errors.country?.message}
              {...register("country")}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Facility Phone"
                type="tel"
                placeholder="+234 800 000 0000"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                label="Facility Email"
                type="email"
                placeholder="info@hospital.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              size="lg"
              className="mt-2"
            >
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

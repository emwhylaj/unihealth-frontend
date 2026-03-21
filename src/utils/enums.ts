// Maps backend integer enum values to display strings

export const genderMap: Record<number, string> = {
  1: "Male",
  2: "Female",
};

export const maritalStatusMap: Record<number, string> = {
  1: "Single",
  2: "Married",
  3: "Divorced",
  4: "Widowed",
};

export const bloodGroupMap: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

// Reverse maps for sending to API (display string → enum name)
export const bloodGroupToApi: Record<string, string> = {
  "A+": "APositive",
  "A-": "ANegative",
  "B+": "BPositive",
  "B-": "BNegative",
  "AB+": "ABPositive",
  "AB-": "ABNegative",
  "O+": "OPositive",
  "O-": "ONegative",
};

export const genderToApi: Record<string, string> = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
};

/** Decode a gender value that may be an integer or already a string */
export function decodeGender(value: number | string | undefined): string {
  if (!value && value !== 0) return "—";
  if (typeof value === "number") return genderMap[value] ?? String(value);
  return value;
}

/** Decode a marital status value that may be an integer or already a string */
export function decodeMaritalStatus(value: number | string | undefined): string {
  if (!value && value !== 0) return "—";
  if (typeof value === "number") return maritalStatusMap[value] ?? String(value);
  return value;
}

/** Decode a blood group value that may be an integer or already a string */
export function decodeBloodGroup(value: number | string | undefined): string {
  if (!value && value !== 0) return "—";
  if (typeof value === "number") return bloodGroupMap[value] ?? String(value);
  // Handle API enum name format e.g. "APositive" → "A+"
  const reverseMap: Record<string, string> = {
    APositive: "A+", ANegative: "A-",
    BPositive: "B+", BNegative: "B-",
    ABPositive: "AB+", ABNegative: "AB-",
    OPositive: "O+", ONegative: "O-",
  };
  return reverseMap[value] ?? value;
}

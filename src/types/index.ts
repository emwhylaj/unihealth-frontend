// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  role: number; // 1=Patient, 2=Hospital, 3=Admin (UserRole enum)
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    patientId?: string;
  };
}

export interface GoogleAuthRequest {
  idToken: string;
  role?: string;
}

export interface AppleAuthRequest {
  idToken: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Patient Types
export type Gender = "Male" | "Female" | "Other";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
export type AllergySeverity = "Mild" | "Moderate" | "Severe";
export type ConditionStatus = "Active" | "Inactive" | "Resolved";
export type RecordType =
  | "BloodPressure"
  | "BloodGlucose"
  | "BloodSugar"
  | "Cholesterol"
  | "HeartRate"
  | "Temperature"
  | "Weight"
  | "Height"
  | "OxygenSaturation"
  | "Custom";

export interface CreatePatientProfileRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  bloodGroup?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  allergies?: string[];
  healthConditions?: string[];
  medications?: string[];
}

export interface PatientProfileResponse {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  bloodGroup?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhotoUrl?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  allergies?: AllergyResponse[];
  healthConditions?: HealthConditionResponse[];
  medications?: string[];
}

// Allergy Types
export interface AllergyResponse {
  id: string;
  name: string;
  severity: AllergySeverity;
  notes?: string;
}

export interface CreateAllergyRequest {
  name: string;
  severity: AllergySeverity;
  notes?: string;
}

// Health Condition Types
export interface HealthConditionResponse {
  id: string;
  name: string;
  status: ConditionStatus;
  diagnosedDate?: string;
  notes?: string;
}

export interface CreateConditionRequest {
  name: string;
  status: ConditionStatus;
  diagnosedDate?: string;
  notes?: string;
}

// Medical Records
export interface MedicalRecordResponse {
  id: string;
  recordType: RecordType;
  label?: string;
  displayName: string;
}

export interface CreateMedicalRecordRequest {
  recordType: RecordType;
  label?: string;
}

export interface MedicalRecordEntryResponse {
  id: string;
  value: number;
  unit: string;
  secondaryValue?: number;
  recordedAt: string;
  notes?: string;
}

export interface CreateMedicalRecordEntryRequest {
  value: number;
  unit: string;
  secondaryValue?: number;
  recordedAt: string;
  notes?: string;
}

// Vital History
export interface VitalHistoryResponse {
  id: string;
  condition: string;
  status: string;
  notes?: string;
}

export interface CreateVitalHistoryRequest {
  condition: string;
  status: string;
  notes?: string;
}

// Access Code
export interface AccessCodeResponse {
  code: string;
  expiresAt: string;
}

// Hospitals Visited
export interface HospitalVisitResponse {
  id: string;
  hospitalName: string;
  hospitalLocation?: string;
  visitDate?: string;
  notes?: string;
}

export interface CreateHospitalVisitRequest {
  hospitalName: string;
  hospitalLocation?: string;
  visitDate?: string;
  notes?: string;
}

// Documents
export interface DocumentResponse {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  description?: string;
  uploadedAt: string;
}

// Auth Store State
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasProfile: boolean;
  profileName: string | null;
  setAuth: (data: AuthResponse) => void;
  setHasProfile: (value: boolean) => void;
  setProfileName: (name: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

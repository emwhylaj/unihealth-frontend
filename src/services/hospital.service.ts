import apiClient from "./api";
import type {
  PatientProfileResponse,
  AllergyResponse,
  HealthConditionResponse,
  MedicalRecordResponse,
  VitalHistoryResponse,
  DocumentResponse,
} from "@/types";

export interface VerifyAccessCodeResponse {
  patientId: string;
  sessionExpiresAt: string;
}

export interface PatientSearchResult {
  patientId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
}

export interface MedicationResponse {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  notes?: string;
}

export type HospitalType = "General" | "Teaching" | "Specialist" | "Clinic" | "Pharmacy";

export interface RegisterHospitalRequest {
  name: string;
  type: HospitalType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface HospitalResponse {
  id: string;
  name: string;
  type: HospitalType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  code: string;
}

export const hospitalService = {
  async registerHospital(data: RegisterHospitalRequest): Promise<HospitalResponse> {
    const response = await apiClient.post<HospitalResponse>("/api/v1/hospital/register", data);
    return response.data;
  },

  async getMyHospital(): Promise<HospitalResponse> {
    const response = await apiClient.get<HospitalResponse>("/api/v1/hospital/me");
    return response.data;
  },


  async verifyAccessCode(code: string): Promise<VerifyAccessCodeResponse> {
    const response = await apiClient.post<VerifyAccessCodeResponse>(
      "/api/v1/hospital/verify-access-code",
      { code }
    );
    return response.data;
  },

  async searchPatients(phone: string): Promise<PatientSearchResult[]> {
    const response = await apiClient.get<PatientSearchResult[]>(
      `/api/v1/hospital/search/patients`,
      { params: { phone } }
    );
    return response.data;
  },

  async getPatientProfile(patientId: string): Promise<PatientProfileResponse> {
    const response = await apiClient.get<PatientProfileResponse>(
      `/api/v1/hospital/patient/${patientId}/`
    );
    return response.data;
  },

  async getPatientAllergies(patientId: string): Promise<AllergyResponse[]> {
    const response = await apiClient.get<AllergyResponse[]>(
      `/api/v1/hospital/patient/${patientId}/allergies`
    );
    return response.data;
  },

  async getPatientConditions(
    patientId: string
  ): Promise<HealthConditionResponse[]> {
    const response = await apiClient.get<HealthConditionResponse[]>(
      `/api/v1/hospital/patient/${patientId}/conditions`
    );
    return response.data;
  },

  async getPatientMedications(
    patientId: string
  ): Promise<MedicationResponse[]> {
    const response = await apiClient.get<MedicationResponse[]>(
      `/api/v1/hospital/patient/${patientId}/medications`
    );
    return response.data;
  },

  async getPatientMedicalRecords(
    patientId: string
  ): Promise<MedicalRecordResponse[]> {
    const response = await apiClient.get<MedicalRecordResponse[]>(
      `/api/v1/hospital/patient/${patientId}/medical-records`
    );
    return response.data;
  },

  async getPatientVitalHistory(
    patientId: string
  ): Promise<VitalHistoryResponse[]> {
    const response = await apiClient.get<VitalHistoryResponse[]>(
      `/api/v1/hospital/patient/${patientId}/vital-history`
    );
    return response.data;
  },

  async getPatientDocuments(patientId: string): Promise<DocumentResponse[]> {
    const response = await apiClient.get<DocumentResponse[]>(
      `/api/v1/hospital/patient/${patientId}/documents`
    );
    return response.data;
  },
};

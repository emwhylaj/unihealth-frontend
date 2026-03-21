import apiClient from "./api";
import type {
  PatientProfileResponse,
  CreatePatientProfileRequest,
  AllergyResponse,
  CreateAllergyRequest,
  HealthConditionResponse,
  CreateConditionRequest,
  MedicalRecordResponse,
  CreateMedicalRecordRequest,
  MedicalRecordEntryResponse,
  CreateMedicalRecordEntryRequest,
  VitalHistoryResponse,
  CreateVitalHistoryRequest,
  AccessCodeResponse,
  HospitalVisitResponse,
  CreateHospitalVisitRequest,
  DocumentResponse,
} from "@/types";

export const patientService = {
  // Profile
  async createProfile(
    data: CreatePatientProfileRequest
  ): Promise<PatientProfileResponse> {
    const response = await apiClient.post<PatientProfileResponse>(
      "/api/v1/patient/profile",
      data
    );
    return response.data;
  },

  async getProfile(): Promise<PatientProfileResponse> {
    const response = await apiClient.get<PatientProfileResponse>(
      "/api/v1/patient/profile"
    );
    return response.data;
  },

  async updateProfile(
    data: Partial<CreatePatientProfileRequest>
  ): Promise<PatientProfileResponse> {
    const response = await apiClient.put<PatientProfileResponse>(
      "/api/v1/patient/profile",
      data
    );
    return response.data;
  },

  async uploadProfilePhoto(file: File): Promise<PatientProfileResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<PatientProfileResponse>(
      "/api/v1/patient/profile/photo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // Allergies
  async getAllergies(): Promise<AllergyResponse[]> {
    const response = await apiClient.get<AllergyResponse[]>(
      "/api/v1/patient/allergies"
    );
    return response.data;
  },

  async createAllergy(data: CreateAllergyRequest): Promise<AllergyResponse> {
    const response = await apiClient.post<AllergyResponse>(
      "/api/v1/patient/allergies",
      data
    );
    return response.data;
  },

  async deleteAllergy(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/patient/allergies/${id}`);
  },

  // Health Conditions
  async getConditions(): Promise<HealthConditionResponse[]> {
    const response = await apiClient.get<HealthConditionResponse[]>(
      "/api/v1/patient/conditions"
    );
    return response.data;
  },

  async createCondition(
    data: CreateConditionRequest
  ): Promise<HealthConditionResponse> {
    const response = await apiClient.post<HealthConditionResponse>(
      "/api/v1/patient/conditions",
      data
    );
    return response.data;
  },

  async deleteCondition(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/patient/conditions/${id}`);
  },

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecordResponse[]> {
    const response = await apiClient.get<MedicalRecordResponse[]>(
      "/api/v1/patient/medical-records"
    );
    return response.data;
  },

  async createMedicalRecord(
    data: CreateMedicalRecordRequest
  ): Promise<MedicalRecordResponse> {
    const response = await apiClient.post<MedicalRecordResponse>(
      "/api/v1/patient/medical-records",
      data
    );
    return response.data;
  },

  async getMedicalRecordEntries(
    recordId: string,
    last?: number
  ): Promise<MedicalRecordEntryResponse[]> {
    const params = last ? `?last=${last}` : "";
    const response = await apiClient.get<MedicalRecordEntryResponse[]>(
      `/api/v1/patient/medical-records/${recordId}/entries${params}`
    );
    return response.data;
  },

  async addMedicalRecordEntry(
    recordId: string,
    data: CreateMedicalRecordEntryRequest
  ): Promise<MedicalRecordEntryResponse> {
    const response = await apiClient.post<MedicalRecordEntryResponse>(
      `/api/v1/patient/medical-records/${recordId}/entries`,
      data
    );
    return response.data;
  },

  // Vital History
  async getVitalHistory(): Promise<VitalHistoryResponse[]> {
    const response = await apiClient.get<VitalHistoryResponse[]>(
      "/api/v1/patient/vital-history"
    );
    return response.data;
  },

  async createVitalHistory(
    data: CreateVitalHistoryRequest
  ): Promise<VitalHistoryResponse> {
    const response = await apiClient.post<VitalHistoryResponse>(
      "/api/v1/patient/vital-history",
      data
    );
    return response.data;
  },

  async deleteVitalHistory(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/patient/vital-history/${id}`);
  },

  // Access Code
  async generateAccessCode(): Promise<AccessCodeResponse> {
    const response = await apiClient.post<AccessCodeResponse>(
      "/api/v1/patient/access-code/generate"
    );
    return response.data;
  },

  async getActiveAccessCode(): Promise<AccessCodeResponse | null> {
    try {
      const response = await apiClient.get<AccessCodeResponse>(
        "/api/v1/patient/access-code/active"
      );
      return response.status === 204 ? null : response.data;
    } catch {
      return null;
    }
  },

  // Hospitals Visited
  async getHospitalsVisited(): Promise<HospitalVisitResponse[]> {
    const response = await apiClient.get<HospitalVisitResponse[]>(
      "/api/v1/patient/hospitals-visited"
    );
    return response.data;
  },

  async addHospitalVisit(
    data: CreateHospitalVisitRequest
  ): Promise<HospitalVisitResponse> {
    const response = await apiClient.post<HospitalVisitResponse>(
      "/api/v1/patient/hospitals-visited",
      data
    );
    return response.data;
  },

  async deleteHospitalVisit(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/patient/hospitals-visited/${id}`);
  },

  // Documents
  async getDocuments(): Promise<DocumentResponse[]> {
    const response = await apiClient.get<DocumentResponse[]>(
      "/api/v1/patient/documents"
    );
    return response.data;
  },

  async uploadDocument(
    file: File,
    description?: string
  ): Promise<DocumentResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }
    const response = await apiClient.post<DocumentResponse>(
      "/api/v1/patient/documents",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};

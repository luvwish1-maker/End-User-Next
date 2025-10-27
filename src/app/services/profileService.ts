import api from '../lib/axios';
import { Address, ApiResponse, BankDetails, Profile, UpdateProfilePayload } from '../types/profile';

const ProfileService = {
    // 🔹 Profile
    getProfile: () => api.get<ApiResponse<Profile>>('/auth/customer/profile'),
    createProfile: (payload: Profile) => api.post<ApiResponse<Profile>>('/auth/profile', payload),
    updateProfile: (payload: UpdateProfilePayload) => api.patch<ApiResponse<Profile>>('/auth/profile', payload),
    updatePassword: (payload: { oldPassword: string; newPassword: string }) =>
        api.patch<ApiResponse<unknown>>('/auth/change-password', payload),

    // 🔹 Bank Details
    getBankDetails: () => api.get<ApiResponse<BankDetails[]>>('/bank-details'),
    addBankDetails: (payload: BankDetails) => api.post<ApiResponse<BankDetails>>('/bank-details', payload),
    updateBankDetails: (payload: BankDetails) => api.patch<ApiResponse<BankDetails>>('/bank-details', payload),
    deleteBankDetails: (id: string) => api.delete<ApiResponse<unknown>>(`/bank-details/${id}`),

    // 🔹 Addresses
    getAddresses: () => api.get<ApiResponse<Address[]>>('/addresses'),
    addAddress: async (payload: Address) => {
        // ✅ Fetch customer profile to attach ID
        const profileRes = await ProfileService.getProfile();
        const customerProfileId = profileRes.data.data?.id;

        if (!customerProfileId) {
            throw new Error("Customer profile ID not found.");
        }

        const finalPayload = { ...payload, customerProfileId };
        return api.post<ApiResponse<Address>>('/addresses', finalPayload);
    },
    updateAddress: (id: string, payload: Partial<Address>) => {
        const { id: _ignoredId, createdAt: _ignoredCreated, updatedAt: _ignoredUpdated, ...allowedPayload } = payload;
        return api.patch<ApiResponse<Address>>(`/addresses/${id}`, allowedPayload);
    },
    deleteAddress: (id: string) => api.delete<ApiResponse<unknown>>(`/addresses/${id}`),
};

export default ProfileService;

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  landmark?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  customerProfileId: string;
}

export interface CustomerProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  profilePicture: string | null;
  addresses: Address[];
  cart: CartItem[];
}

export interface Profile {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  CustomerProfile: CustomerProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
}

export interface BankDetails {
    id?: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName?: string;
}
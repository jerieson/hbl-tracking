export interface Customer {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  country_code?: string;
  contact_number?: string;
  designation?: string;
  company_name: string;
  business_address: string;
  nature_of_business?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  remarks?: string;
  status: 'active' | 'inactive';
  tapped: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFormData {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  contact_number: string;
  designation: string;
  company_name: string;
  business_address: string;
  nature_of_business: string;
  latitude?: number;
  longitude?: number;
  area: string;
  remarks: string;
  status: 'active' | 'inactive';
  tapped: boolean;
}

export interface CustomerFilters {
  status?: 'active' | 'inactive' | 'all';
  tapped?: boolean | 'all';
  search?: string;
  area?: string;
}
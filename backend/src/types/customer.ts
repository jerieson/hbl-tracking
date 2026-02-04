export interface Customer {
  id?: number;
  user_id: number;
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
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerFilters {
  status?: 'active' | 'inactive';
  tapped?: boolean;
  search?: string;
  area?: string;
  user_id?: number;
}
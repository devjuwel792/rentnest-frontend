export interface Category {
  id: string;
  name: string;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Review {
  id: string;
  tenantName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  address?: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  available?: boolean;
  category?: Category;
  categoryId?: string;
  landlord?: Landlord;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  categoryId?: string;
  minRent?: string;
  maxRent?: string;
  bedrooms?: string;
}

export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export interface RentalTenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId?: string;
  status: string;
  moveInDate: string;
  monthlyRent?: number;
  createdAt: string;
  updatedAt?: string;
  property?: Property;
  landlord?: Landlord;
  tenant?: RentalTenant;
  tenantName?: string;
}

export interface PropertyInput {
  title: string;
  description: string;
  address: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  categoryId?: string;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  status: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt?: string;
  rental?: Rental;
  property?: Property;
}

export interface CheckoutSession {
  url: string;
  sessionId?: string;
}

export interface ReviewInput {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  phone?: string;
  createdAt?: string;
  propertiesCount?: number;
  rentalsCount?: number;
}

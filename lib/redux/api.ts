import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  AdminUser,
  AuthResponse,
  Category,
  CheckoutSession,
  LoginInput,
  Payment,
  Property,
  PropertyFilters,
  PropertyInput,
  RegisterInput,
  Rental,
  RentalInput,
  ReviewInput,
} from "../types";
import type { AuthUser } from "../auth";
import { getStoredToken } from "../auth";

export function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error !== "object") return "Something went wrong.";

  const record = error as Record<string, unknown>;

  if ("data" in record) {
    const data = record.data;
    if (typeof data === "string" && data) return data;
    if (data && typeof data === "object") {
      const body = data as Record<string, unknown>;
      if (typeof body.message === "string" && body.message) return body.message;
      if (typeof body.error === "string" && body.error) return body.error;
    }
  }
  if (typeof record.message === "string" && record.message) {
    return record.message;
  }
  if (typeof record.status === "number" || typeof record.status === "string") {
    return `Request failed (${String(record.status)})`;
  }
  return "Something went wrong.";
}

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

function extractData(response: unknown): Record<string, unknown> | undefined {
  if (typeof response === "object" && response !== null) {
    const data = (response as { data?: unknown }).data;
    if (data && typeof data === "object") {
      return data as Record<string, unknown>;
    }
  }
  return undefined;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Property", "Rental", "User", "Payment", "Category"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (input) => ({ url: "/auth/login", method: "POST", body: input }),
      transformResponse: (response: unknown) => {
        const data = extractData(response);
        if (
          !data ||
          typeof data.accessToken !== "string" ||
          !data.user
        ) {
          throw new Error("Invalid email or password.");
        }
        return data as unknown as AuthResponse;
      },
    }),
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (input) => ({
        url: "/auth/register",
        method: "POST",
        body: input,
      }),
      transformResponse: (response: unknown) => {
        const data = extractData(response);
        if (
          !data ||
          typeof data.accessToken !== "string" ||
          !data.user
        ) {
          throw new Error("Registration failed. Please try again.");
        }
        return data as unknown as AuthResponse;
      },
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => ({ url: "/auth/me" }),
      transformResponse: (response: unknown) => {
        const data = extractData(response);
        const user = (data?.user ?? data) as AuthUser | undefined;
        if (!user) throw new Error("Could not load your profile.");
        return user;
      },
    }),
    getProperties: builder.query<Property[], PropertyFilters | void>({
      query: (filters) => ({ url: "/properties", params: filters ?? {} }),
      providesTags: ["Property"],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/categories" }),
      providesTags: ["Category"],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => ({ url: `/categories/${id}` }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, { name: string }>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => ({ url: `/properties/${id}` }),
      providesTags: ["Property"],
    }),
    getMyRentals: builder.query<Rental[], void>({
      query: () => ({ url: "/rentals" }),
      providesTags: ["Rental"],
    }),
    getRental: builder.query<Rental, string>({
      query: (id) => ({ url: `/rentals/${id}` }),
      providesTags: ["Rental"],
    }),
    createRental: builder.mutation<Rental, RentalInput>({
      query: (input) => ({ url: "/rentals", method: "POST", body: input }),
      invalidatesTags: ["Rental"],
    }),
    getMyPayments: builder.query<Payment[], void>({
      query: () => ({ url: "/payments" }),
      providesTags: ["Payment"],
    }),
    getPayment: builder.query<Payment, string>({
      query: (id) => ({ url: `/payments/${id}` }),
      providesTags: ["Payment"],
    }),
    getMyProperties: builder.query<Property[], void>({
      query: () => ({ url: "/properties/my-properties" }),
      providesTags: ["Property"],
    }),
    getLandlordRequests: builder.query<Rental[], void>({
      query: () => ({ url: "/landlord/requests" }),
      providesTags: ["Rental"],
    }),
    getAdminUsers: builder.query<AdminUser[], string | void>({
      query: (role) => ({
        url: "/admin/users",
        params: role ? { role } : undefined,
      }),
      providesTags: ["User"],
    }),
    getAdminProperties: builder.query<Property[], void>({
      query: () => ({ url: "/admin/properties" }),
      providesTags: ["Property"],
    }),
    getAdminRentals: builder.query<Rental[], void>({
      query: () => ({ url: "/admin/rentals" }),
      providesTags: ["Rental"],
    }),
    createProperty: builder.mutation<Property, PropertyInput>({
      query: (input) => ({
        url: "/properties",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Property"],
    }),
    updateProperty: builder.mutation<
      Property,
      { id: string; input: Partial<PropertyInput> }
    >({
      query: ({ id, input }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: input,
      }),
      invalidatesTags: ["Property"],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["Property"],
    }),
    togglePropertyAvailability: builder.mutation<Property, string>({
      query: (id) => ({
        url: `/properties/${id}/availability`,
        method: "PATCH",
      }),
      invalidatesTags: ["Property"],
    }),
    updateRentalRequestStatus: builder.mutation<
      Rental,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/landlord/requests/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Rental"],
    }),
    updateUserStatus: builder.mutation<
      AdminUser,
      { id: string; status: "ACTIVE" | "BANNED" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
    createCheckoutSession: builder.mutation<CheckoutSession, string>({
      query: (rentalId) => ({
        url: "/payments/create",
        method: "POST",
        body: { rentalId },
      }),
      transformResponse: (response: unknown) => {
        const data =
          typeof response === "object" && response !== null
            ? (response as { data?: Record<string, unknown> }).data ?? {}
            : {};
        const url =
          data.url ??
          data.checkoutUrl ??
          (data.checkout_session as { url?: unknown } | undefined)?.url;
        if (typeof url !== "string" || !url) {
          throw new Error("Checkout URL missing from response.");
        }
        return {
          url,
          sessionId:
            (data.sessionId as string | undefined) ??
            (data.session as { id?: unknown } | undefined)?.id,
        } as CheckoutSession;
      },
      invalidatesTags: ["Payment"],
    }),
    createReview: builder.mutation<void, ReviewInput>({
      query: (input) => ({
        url: "/reviews",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Property"],
    }),
    confirmPayment: builder.mutation<unknown, string>({
      query: (sessionId) => ({
        url: `/payments/confirm?session_id=${encodeURIComponent(sessionId)}`,
        method: "GET",
      }),
      invalidatesTags: ["Payment", "Rental"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetPropertiesQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetPropertyQuery,
  useGetMyRentalsQuery,
  useGetRentalQuery,
  useCreateRentalMutation,
  useGetMyPaymentsQuery,
  useGetPaymentQuery,
  useGetMyPropertiesQuery,
  useGetLandlordRequestsQuery,
  useGetAdminUsersQuery,
  useGetAdminPropertiesQuery,
  useGetAdminRentalsQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useTogglePropertyAvailabilityMutation,
  useUpdateRentalRequestStatusMutation,
  useUpdateUserStatusMutation,
  useCreateCheckoutSessionMutation,
  useCreateReviewMutation,
  useConfirmPaymentMutation,
} = api;

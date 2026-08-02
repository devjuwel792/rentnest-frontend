import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  AdminUser,
  Category,
  CheckoutSession,
  Payment,
  Property,
  PropertyFilters,
  PropertyInput,
  Rental,
  ReviewInput,
} from "../types";
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

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Property", "Rental", "User", "Payment", "Category"],
  endpoints: (builder) => ({
    getProperties: builder.query<Property[], PropertyFilters | void>({
      query: (filters) => ({ url: "/properties", params: filters ?? {} }),
      providesTags: ["Property"],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/categories" }),
      providesTags: ["Category"],
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
    getMyPayments: builder.query<Payment[], void>({
      query: () => ({ url: "/payments" }),
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
  useGetPropertiesQuery,
  useGetCategoriesQuery,
  useGetPropertyQuery,
  useGetMyRentalsQuery,
  useGetRentalQuery,
  useGetMyPaymentsQuery,
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

import type {
  CheckoutSession,
  Property,
  PropertyInput,
  Rental,
  ReviewInput,
} from "./types";
import { api, getErrorMessage, store } from "./redux";

export { getErrorMessage };

export type {
  CheckoutSession,
  Property,
  PropertyInput,
  Rental,
  ReviewInput,
  QueryResult,
} from "./types";

export {
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
} from "./redux";

export async function createProperty(
  input: PropertyInput
): Promise<Property> {
  const result = await store.dispatch(
    api.endpoints.createProperty.initiate(input)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Property;
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const result = await store.dispatch(
    api.endpoints.updateProperty.initiate({ id, input })
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const result = await store.dispatch(
    api.endpoints.deleteProperty.initiate(id)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
}

export async function togglePropertyAvailability(
  id: string
): Promise<Property> {
  const result = await store.dispatch(
    api.endpoints.togglePropertyAvailability.initiate(id)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Property;
}

export async function updateRentalRequestStatus(
  id: string,
  status: string
): Promise<Rental> {
  const result = await store.dispatch(
    api.endpoints.updateRentalRequestStatus.initiate({ id, status })
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Rental;
}

export async function updateUserStatus(
  id: string,
  status: "ACTIVE" | "BANNED"
): Promise<void> {
  const result = await store.dispatch(
    api.endpoints.updateUserStatus.initiate({ id, status })
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
}

export async function createCheckoutSession(
  rentalId: string
): Promise<CheckoutSession> {
  const result = await store.dispatch(
    api.endpoints.createCheckoutSession.initiate(rentalId)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as CheckoutSession;
}

export async function createReview(input: ReviewInput): Promise<void> {
  const result = await store.dispatch(
    api.endpoints.createReview.initiate(input)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
}

export async function confirmPayment(sessionId: string): Promise<unknown> {
  const result = await store.dispatch(
    api.endpoints.confirmPayment.initiate(sessionId)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data;
}

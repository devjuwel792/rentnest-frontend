import type {
  AuthResponse,
  Category,
  CheckoutSession,
  LoginInput,
  Property,
  PropertyInput,
  RegisterInput,
  Rental,
  RentalInput,
  ReviewInput,
} from "./types";
import type { AuthUser } from "./auth";
import { api, getErrorMessage, store } from "./redux";

export { getErrorMessage };

export type {
  AuthResponse,
  Category,
  CheckoutSession,
  LoginInput,
  Property,
  PropertyInput,
  RegisterInput,
  Rental,
  RentalInput,
  ReviewInput,
  QueryResult,
} from "./types";
export type { AuthUser } from "./auth";

export {
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
} from "./redux";

export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    const result = await store.dispatch(api.endpoints.login.initiate(input));
    if (result.error) throw new Error(getErrorMessage(result.error));
    return result.data as AuthResponse;
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Invalid email or password.");
  }
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  try {
    const result = await store.dispatch(
      api.endpoints.register.initiate(input)
    );
    if (result.error) throw new Error(getErrorMessage(result.error));
    return result.data as AuthUser;
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Registration failed. Please try again.");
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const result = await store.dispatch(api.endpoints.getMe.initiate());
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as AuthUser;
}

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

export async function createRental(input: RentalInput): Promise<Rental> {
  const result = await store.dispatch(
    api.endpoints.createRental.initiate(input)
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Rental;
}

export async function createCategory(
  name: string
): Promise<Category> {
  const result = await store.dispatch(
    api.endpoints.createCategory.initiate({ name })
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Category;
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  const result = await store.dispatch(
    api.endpoints.updateCategory.initiate({ id, name })
  );
  if (result.error) throw new Error(getErrorMessage(result.error));
  return result.data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const result = await store.dispatch(
    api.endpoints.deleteCategory.initiate(id)
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

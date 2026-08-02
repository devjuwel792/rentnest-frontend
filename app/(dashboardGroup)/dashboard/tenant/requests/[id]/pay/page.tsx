import type { Metadata } from "next";
import CheckoutPage from "../../../../../_components/tenant/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | RentNest",
  description: "Complete your rental payment securely with Stripe.",
};

const RentalPayPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <CheckoutPage rentalId={id} />;
};

export default RentalPayPage;

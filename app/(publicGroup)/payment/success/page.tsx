import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentSuccess from "../../_components/payment/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment Successful | RentNest",
  description: "Your rental payment was confirmed.",
};

const PaymentSuccessPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <p className="text-sm text-gray-500">Checking payment status...</p>
        }
      >
        <PaymentSuccess />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;

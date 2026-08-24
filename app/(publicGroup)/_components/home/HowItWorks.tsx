const STEPS = [
  {
    step: "01",
    title: "Browse & Filter",
    desc: "Search verified listings by location, price, category, and bedrooms.",
  },
  {
    step: "02",
    title: "Request Move-In",
    desc: "Select your move-in date and send a digital request directly to the landlord.",
  },
  {
    step: "03",
    title: "Landlord Approves",
    desc: "Receive immediate notification once the landlord approves your booking.",
  },
  {
    step: "04",
    title: "Pay & Move In",
    desc: "Pay securely via Stripe and move into your new dream home!",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
          🚀 Simple 4-Step Process
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          How RentNest Works
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Renting your next home has never been this simple and seamless.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="relative flex flex-col rounded-3xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-indigo-400 hover:shadow-lg"
          >
            <span className="text-4xl font-black text-indigo-100">
              {item.step}
            </span>
            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

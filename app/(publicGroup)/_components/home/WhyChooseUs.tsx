import Link from "next/link";

const FEATURES = [
  {
    icon: "🛡️",
    title: "100% Verified Properties",
    description: "Every property listing is verified for legal ownership and authentic photos before being listed.",
    color: "from-blue-500/10 to-indigo-500/10 text-indigo-600",
  },
  {
    icon: "⚡",
    title: "Instant Digital Requests",
    description: "Submit move-in requests directly to landlords without middlemen or unnecessary delays.",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Escrow Payments",
    description: "Secure monthly rent payments processed safely with Stripe. Funds released only when agreed.",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
  },
  {
    icon: "⭐",
    title: "Verified Tenant Reviews",
    description: "Transparent post-stay ratings & reviews from real verified tenants to guide your decisions.",
    color: "from-purple-500/10 to-violet-500/10 text-purple-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-b from-white via-indigo-50/30 to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
            ✨ Why RentNest
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for a stress-free rental experience
          </h2>
          <p className="mt-3 text-base text-gray-600">
            We built RentNest to make renting simple, transparent, and secure for tenants and landlords alike.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-2xl font-bold transition-transform duration-300 group-hover:scale-110`}
              >
                {feat.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">
                {feat.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

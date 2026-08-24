import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

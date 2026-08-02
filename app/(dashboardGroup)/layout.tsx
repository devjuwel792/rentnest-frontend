import DashboardShell from "./_components/DashboardShell";

const DashboardGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default DashboardGroupLayout;

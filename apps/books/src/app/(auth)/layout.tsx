export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #FDF6EE 0%, #ffffff 50%, #F5E6D3 100%)" }}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #F5E6D3 0%, #F2D8BE 40%, #EBC9A8 100%)",
      }}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

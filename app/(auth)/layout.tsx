export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen bg-sign-in bg-no-repeat bg-cover ">
      {children}
    </main>
  );
}

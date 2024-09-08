import SidebarProfile from "@/shared/Account/Profile/ui/SidebarProfile";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-6 md:mx-10 lg:mx-20 xl:mx-32 overflow-auto h-full">
      <div className="col-span-1  p-5">
        <SidebarProfile />
      </div>
      <div className="col-span-5  p-5">{children}</div>
    </div>
  );
}

import FormLeft from "./ui/FormLeft";
import FormRight from "./ui/FormRight";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen  bg-sign-in bg-no-repeat bg-cover ">
      <div className=" bg-cover bg-no-repeat md:w-10/12 lg:w-8/12 h-3/4 drop-shadow-2xl  rounded-xl  grid grid-cols-1 grid-rows-1 md:grid-cols-2 gap-4 backdrop-blur-sm bg-white/40 ">
        <FormLeft />
        <FormRight>{children}</FormRight>
      </div>
    </main>
  );
}

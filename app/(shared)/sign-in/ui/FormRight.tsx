const FormRight = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="col-span-1   bg-white/50 w-full  flex justify-center items-center ">
      <div className="container flex justify-center items-center  p-6 lg:p-8 xl:p-14 ">
        {children}
      </div>
    </div>
  );
};

export default FormRight;

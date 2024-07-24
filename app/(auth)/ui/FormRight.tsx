const FormRight = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="col-span-1  bg-white/50 w-full overflow-y-auto">
      <div className="container mx-auto  overflow-auto p-6 lg:p-8 xl:p-14 ">
        {children}
      </div>
    </div>
  );
};

export default FormRight;
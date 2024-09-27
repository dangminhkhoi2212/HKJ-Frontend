import { Button, TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";
import { useQueries } from "react-query";

import { initPagination } from "@/const";
import { hireService } from "@/services";
import { TQuery } from "@/types";
import { THire } from "@/types/hireType";

const ListHire = () => {
  const [query, setQuery] = useState<TQuery<null>>({
    page: 0,
    size: 8,
  } as TQuery<null>);
  const [hires, setHires] = useState<THire[]>([]);
  console.log("🚀 ~ ListHire ~ hires:", hires);

  const [pagination, setPagination] =
    useState<TablePaginationConfig>(initPagination);
  const [getHires, getHiresCount] = useQueries([
    {
      queryKey: ["hires", query], // Pass the query state as part of the key
      queryFn: () => hireService.get(query),
      onSuccess(data: THire[]) {
        setHires(data);
      }, // Pass the query object
      onError(error: any) {
        console.log("🚀 ~ file: ListHire.tsx:ListHire ~ error:", error);
      },
    },
    {
      queryKey: ["hires-count", query], // Use the same query object for count
      queryFn: () => hireService.getCount(query),
      onSuccess: (data: number) =>
        setPagination({ ...pagination, total: data }),
      onError: (error: any) => {
        console.log("🚀 ~ file: ListHire.tsx:ListHire ~ error:", error);
      },
    },
  ]);

  const refresh = () => {
    getHires.refetch();
    getHiresCount.refetch();
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div>
      <Button
        onClick={() => {
          refresh();
        }}
      >
        Tạo mới
      </Button>
    </div>
  );
};

export default ListHire;

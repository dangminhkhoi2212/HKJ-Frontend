import positionService from "@/services/position.service";
import InputSearchCustom from "@/shared/InputSearchCustom";
import { TPosition, TPositionQuery } from "@/types/postion.type";
import { Button, Divider, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueries } from "react-query";
import { initPositionQuery } from "../../positions/page";
import { TSelectedPositionHire } from "./HireEmployeeForm";
type TPros = {
  setSeletedPosition: React.Dispatch<
    React.SetStateAction<TSelectedPositionHire>
  >;
};
interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

const PositoinOption: React.FC<TPros> = ({ setSeletedPosition }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TPosition[]>([]);
  console.log("🚀 ~ data:", data);
  const [pageCount, setPageCount] = useState<number>(99999);
  console.log("🚀 ~ pageCount:", pageCount);
  const [query, setQuery] = useState<TPositionQuery>({
    ...initPositionQuery,
    size: 8,
  });

  const [getPositionsQuery, getPositionsCountQuery] = useQueries([
    {
      queryKey: ["positions", { ...query }],
      queryFn: () => positionService.get(query),
      onSuccess: (dataRepsonse: TPosition[]) => {
        console.log("🚀 ~ useAdminPositionsAction ~ data:", data);
        setData([...data, ...dataRepsonse]);
      },
      onError: (error: any) => {
        console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
      },
    },
    {
      queryKey: ["positions-count", { ...query }],
      queryFn: () => positionService.getCount(query),
      onSuccess: (data: number) => {
        // setPagination((pre) => ({ ...pre, total: data }));
        setPageCount(data);
      },
      onError: (error: any) => {
        console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
      },
    },
  ]);

  const loadMoreData = () => {
    setQuery((pre) => ({ ...pre, page: pre.page! + 1 }));
    console.log("🚀 ~ loadMoreData ~ query:", query);

    // refreshPositionsData();
  };

  const refreshPositionsData = async () => {
    getPositionsQuery.refetch();
    getPositionsCountQuery.refetch();
  };

  useEffect(() => {
    refreshPositionsData();
  }, []);
  const handleSearch = (value: string) => {
    setQuery((pre) => ({ ...pre, "name.contains": value, page: 0 }));
    setData([]);
  };
  return (
    <div>
      <InputSearchCustom handleSearch={handleSearch} />
      <p className="font-medium text-xs mt-2">
        Tổng số vị trí: {getPositionsCountQuery.data}
      </p>
      <div id="scrollableDiv" className=" overflow-auto p-5 h-[350px] ">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < pageCount}
          loader={<Skeleton paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>Không còn dữ liệu 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    key={item.id}
                    onClick={() =>
                      setSeletedPosition({ show: false, record: item })
                    }
                  >
                    Chọn
                  </Button>,
                ]}
              >
                <List.Item.Meta title={<p>{item.name}</p>} />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PositoinOption;

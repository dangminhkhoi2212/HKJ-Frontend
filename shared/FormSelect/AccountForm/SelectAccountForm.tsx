import { Button, Divider, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueries } from "react-query";

import { AUTHORIZATIONS_CONST } from "@/const";
import { userService } from "@/services";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TAccontQuery, TAccountInfo, TQuery } from "@/types";

const { AUTHORIZATIONS } = AUTHORIZATIONS_CONST;
type TPros = {
  onChange: (selectedPosition: TAccountInfo) => void;
};

const SelectAccountForm: React.FC<TPros> = ({ onChange }) => {
  const [data, setData] = useState<TAccountInfo[]>([]);
  const [pageCount, setPageCount] = useState<number>(99999);
  const [query, setQuery] = useState<TQuery<TAccontQuery>>({
    role: AUTHORIZATIONS.ROLE_EMPLOYEE,
    page: 0,
    size: 8,
  });

  const [getQuery, getCountQuery] = useQueries([
    {
      queryKey: ["accounts", { ...query }],
      queryFn: () => userService.getUsersByRole(query),
      onSuccess: (dataRepsonse: TAccountInfo[]) => {
        setData([...data, ...dataRepsonse]);
      },
      onError: (error: any) => {
        console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
      },
    },
    {
      queryKey: ["accounts-count", { ...query }],
      queryFn: () => userService.getUsersByRoleCount(query),
      onSuccess: (data: any) => {
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
  };

  const refreshData = async () => {
    getQuery.refetch();
    getCountQuery.refetch();
  };

  useEffect(() => {
    return () => {
      refreshData();
    };
  }, []);
  const handleSearch = (value: string) => {
    setQuery((pre) => ({ ...pre, "name.contains": value, page: 0 }));
    setData([]);
  };
  const handleOnchange = (data: TAccountInfo) => {
    if (onChange) {
      onChange(data);
    }
  };
  return (
    <div>
      <InputSearchCustom handleSearch={handleSearch} />
      <p className="font-medium text-xs mt-2">
        Tổng số vị trí: {getCountQuery.data || 0}
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
                  <Button key={item.id} onClick={() => handleOnchange(item)}>
                    Chọn
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex flex-col">
                      <p className="p-0 m-0">
                        {item.firstName + " " + item.lastName}
                      </p>
                      <p className="text-xs text-gray-500 m-0">{item.email}</p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default SelectAccountForm;

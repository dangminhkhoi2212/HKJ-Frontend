import { Empty, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

import { TMaterial } from "@/types";

import MaterialCard from "./MaterialCard";

type Props = {
  data: TMaterial[];
  isLoading?: boolean;
};

const MaterialList: React.FC<Props> = ({ data, isLoading = true }) => {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (!data || (!data.length && !loading)) {
    return (
      <div className="flex justify-center items-center w-full">
        <Empty description="Không có dữ liệu" />
      </div>
    );
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
        xxl: 5,
      }}
      dataSource={
        loading
          ? Array.from({ length: 4 }).map(
              (_, idx) =>
                ({
                  id: idx,
                  coverImage: "",
                  name: "",
                  quantity: 0,
                  price: 0,
                  unit: "",
                  unitPrice: 0,
                  supplier: "",
                } as TMaterial)
            )
          : data
      }
      renderItem={(item: TMaterial, index) => (
        <List.Item key={item.id} className="flex justify-center items-center">
          {loading ? (
            <Skeleton
              active
              paragraph={{ rows: 3 }}
              rootClassName="flex flex-col"
            />
          ) : (
            <MaterialCard data={item} />
          )}
        </List.Item>
      )}
    />
  );
};

export default MaterialList;

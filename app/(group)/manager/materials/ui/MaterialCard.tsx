import { Card, Image, Skeleton } from "antd";
import React from "react";
import { NumericFormat } from "react-number-format";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { TMaterial } from "@/types";
import { EditOutlined } from "@ant-design/icons";

const { Meta } = Card;
type Props = {
  data: TMaterial;
};
const MaterialCard: React.FC<Props> = ({ data }) => {
  const { router } = useRouterCustom();
  const extraUnitPrice = () => {
    const unitPrice = data.unitPrice;
    const unit = data.unit;
    return (
      (unitPrice || unit) && (
        <span>
          {
            <NumericFormat
              readOnly
              value={unitPrice}
              displayType="text"
              suffix=" VND"
              thousandSeparator=","
            />
          }
          /{unit}
        </span>
      )
    );
  };
  return (
    <Card
      className="overflow-hidden w-full min-w-40 min-h-28 max-w-60 "
      cover={
        <Image
          alt="example"
          src={data.coverImage}
          preview={false}
          placeholder={
            <Skeleton.Image active={true} className="w-full h-full" />
          }
          className="min-h-full "
        />
      }
      actions={[
        <EditOutlined
          key="edit"
          className="w-full"
          onClick={() =>
            router.push(routesManager.updateMaterial(data?.id!.toString()))
          }
        />,
      ]}
    >
      <Meta title={data.name} description={extraUnitPrice()} />
    </Card>
  );
};

export default MaterialCard;

import { Card, Image } from "antd";
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
      style={{ width: 300 }}
      className="overflow-hidden"
      cover={
        <Image
          alt="example"
          src={data.coverImage}
          preview={false}
          className="min-h-28"
        />
      }
      actions={[
        <EditOutlined
          key="edit"
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

import { Card } from "antd";
import Image from "next/image";
import React from "react";

const TrackProductCard = () => {
  const cover: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > = (
    <div className="relative w-full h-full">
      <Image
        alt="text"
        src={
          "https://product.hstatic.net/200000103143/product/pngtrpnt_792493c01_rgb_44c8716ede2a46e8a8692a7744234194_e8bb4676da534d27ae5bd0c3f9a15985_master.png"
        }
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
  return (
    <div>
      <Card
        className=" h-40 m-4"
        cover={
          <div className="relative w-full h-full">
            <Image
              alt="text"
              src={
                "https://product.hstatic.net/200000103143/product/pngtrpnt_792493c01_rgb_44c8716ede2a46e8a8692a7744234194_e8bb4676da534d27ae5bd0c3f9a15985_master.png"
              }
              layout="fill"
              objectFit="contain"
            />
          </div>
        }
      >
        <Card.Meta
          title="Nhẫn đính đá kim cương"
          description="Thời gian hoàn thành: 2 ngày nữa"
        />
      </Card>
      ;
    </div>
  );
};

export default TrackProductCard;

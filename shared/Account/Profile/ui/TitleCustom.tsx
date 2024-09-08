import { Typography } from "antd";

const TitleCustom: React.FC<{ title: string; subTitle?: string }> = ({
  title,
  subTitle,
}) => (
  <div className="flex flex-col">
    <Typography.Title level={5} className="text-lg font-semibold">
      {title}
    </Typography.Title>
    <p>{subTitle}</p>
  </div>
);
export default TitleCustom;

import { List, Typography } from "antd";
import { useEffect, useState } from "react";
import { useQueries } from "react-query";

import { QUERY_CONST } from "@/const";
import templateStepService from "@/services/templateStepService";
import { TQuery, TTemplateStep, TTemplateStepQuery } from "@/types";

import { templateStepStore, templateStore } from "../store";
import UpdateTemplateStepForm from "./UpdateTemplateStepForm";

const UpdateTemplateStepFormList = () => {
  const { setPagination, pagination, toggleRefreshStep } = templateStepStore();
  console.log(
    "🚀 ~ UpdateTemplateStepFormList ~ toggleRefreshStep:",
    toggleRefreshStep
  );
  const { templateUpdate, templateCreate } = templateStore();

  const [templateSteps, setTemplateSteps] = useState<TTemplateStep[]>([]);
  const [query, setQuery] = useState<TQuery<TTemplateStepQuery>>({
    ...QUERY_CONST.defaultQuery,
    hkjTemplateId: { equals: templateCreate?.id! || templateUpdate?.id! },
    size: 100,
  });
  const [
    { data, refetch: refreshTemplateSteps, isLoading: isLoadingCategories },
    {
      data: _,
      refetch: refreshTemplatesCount,
      isLoading: isLoadingTemplatesCount,
    },
  ] = useQueries([
    {
      queryKey: ["template-steps", { ...query }],
      queryFn: () => templateStepService.get(query),
      onSuccess(data: TTemplateStep[]) {
        setTemplateSteps(data);
      },
    },
    {
      queryKey: ["template-steps-count", { ...query }],

      queryFn: () => templateStepService.getCount(query),
      onSuccess(data: number) {
        setPagination({ ...pagination, total: data });
      },
    },
  ]);
  useEffect(() => {
    refreshTemplateSteps();
  }, [toggleRefreshStep]);

  return (
    <div>
      <Typography.Title level={5}>Danh sách các bước</Typography.Title>
      <List
        // grid={{ gutter: 16, xs: 2, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }}
        dataSource={templateSteps}
        renderItem={(item: TTemplateStep) => (
          <List.Item key={item.id}>
            <UpdateTemplateStepForm data={item} key={item.id} />
          </List.Item>
        )}
        loading={isLoadingCategories}
      />
    </div>
  );
};

export default UpdateTemplateStepFormList;

import { List, Typography } from "antd";
import { useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import templateStepService from "@/services/templateStepService";
import { TQuery, TTemplateStep, TTemplateStepQuery } from "@/types";
import { useQueries } from "@tanstack/react-query";

import { templateStepStore, templateStore } from "../store";
import UpdateTemplateStepForm from "./UpdateTemplateStepForm";

const UpdateTemplateStepFormList = () => {
	const { setPagination, pagination, toggleRefreshStep } =
		templateStepStore();
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
	const [getTemplateSteps, getTemplateStepsCount] = useQueries({
		queries: [
			{
				queryKey: ["template-steps", { ...query }],
				queryFn: () => templateStepService.get(query),
			},
			{
				queryKey: ["template-steps-count", { ...query }],

				queryFn: () => templateStepService.getCount(query),
			},
		],
	});
	useEffect(() => {
		if (getTemplateSteps.isSuccess) {
			setTemplateSteps(getTemplateSteps.data as TTemplateStep[]);
		}
	}, [getTemplateSteps.data, getTemplateSteps.refetch]);
	useEffect(() => {
		if (getTemplateStepsCount.isSuccess) {
			setPagination({
				...pagination,
				total: getTemplateStepsCount.data as number,
			});
		}
	}, [getTemplateStepsCount.data, getTemplateStepsCount.refetch]);

	const isLoading =
		getTemplateSteps.isPending || getTemplateStepsCount.isPending;
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
				loading={isLoading}
			/>
		</div>
	);
};

export default UpdateTemplateStepFormList;

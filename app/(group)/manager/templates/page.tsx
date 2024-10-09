"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useQueries } from "react-query";

import templateService from "@/services/templateService";
import { Frame } from "@/shared/Frame";

import { templateStore } from "./store";
import { DrawerForm, TemplateList } from "./ui";
import DeleteTemplateFrom from "./ui/DeleteTemplateFrom";

const TemplatePage = () => {
  const {
    toggleRefresh,
    setQuery,
    setOpenDrawer,
    query,
    setPagination,
    pagination,
    reset,
  } = templateStore();
  const [
    {
      data: templates,
      refetch: refreshTemplate,
      isLoading: isLoadingCategories,
    },
    {
      data: _,
      refetch: refreshTemplatesCount,
      isLoading: isLoadingTemplatesCount,
    },
  ] = useQueries([
    {
      queryKey: ["templates", { ...query }],
      queryFn: () => templateService.get(query),
    },
    {
      queryKey: ["templates-count", { ...query }],
      queryFn: () => templateService.getCount(query),
      onSuccess(data: number) {
        setPagination({ ...pagination, total: data });
      },
    },
  ]);

  const refresh = useCallback(() => {
    refreshTemplate();
    refreshTemplatesCount();
  }, []);

  useEffect(() => {
    refresh();
  }, [toggleRefresh]);

  return (
    <Frame
      title="Bản thảo mẫu"
      discription={
        <div className="flex flex-col text-sm text-gray-500 font-medium italic">
          <span>
            Việc tạo bản mẫu trước giúp bạn dễ dàng chọn công viêc khi tạo dự án
          </span>
        </div>
      }
      buttons={
        <Button
          type="primary"
          onClick={() => setOpenDrawer(true)}
          icon={<Plus size={18} />}
        >
          Tạo bản mẫu
        </Button>
      }
    >
      <div>
        <DrawerForm />
        <DeleteTemplateFrom />
        <TemplateList
          data={templates}
          loading={isLoadingCategories || isLoadingTemplatesCount}
        />
      </div>
    </Frame>
  );
};

export default TemplatePage;

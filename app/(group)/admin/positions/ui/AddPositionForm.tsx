import InputCustom from "@/shared/InputCustom";
import { App, Button, Form } from "antd";
import React, { BaseSyntheticEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TPosition,
  TPositionCreate,
  TSelectedPosition,
} from "@/types/postion.type";
import { FormInstance } from "antd/lib";
import { useMutation } from "react-query";
import positionService from "@/services/position.service";
import { FormStatus } from "@/types/form.type";

const AddPositionForm: React.FC<{
  data?: TSelectedPosition;
  refreshPositionsData: () => void;
  setSelectedPosition: React.Dispatch<TSelectedPosition>;
}> = ({ setSelectedPosition, refreshPositionsData, data }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TPosition>({
    defaultValues: data?.record,
  });

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const addPositionMutation = useMutation({
    mutationFn: (data: TPositionCreate) => positionService.create(data),
    onSuccess: () => {
      message.success("Đã thêm vị trí");
      form.resetFields();
      setSelectedPosition({ show: false });
      refreshPositionsData();
    },
    onError: () => {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
    },
  });
  const updatePositionMutation = useMutation({
    mutationFn: (data: TPosition) => positionService.update(data),
    onSuccess: () => {
      message.success("Đã cập nhật thành công");
      form.resetFields();
      setSelectedPosition({ show: false });
      refreshPositionsData();
    },
    onError: () => {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
    },
  });

  const handleFormSubmit = async (position: TPosition) => {
    if (data?.status === FormStatus.UPDATE) {
      updatePositionMutation.mutate(position);
    } else {
      addPositionMutation.mutate(position);
    }
  };

  useEffect(() => {
    form.resetFields();
    if (data?.record?.id) {
      form.setFieldsValue({ ...data.record });
      setValue("id", data?.record?.id);
      setValue("name", data?.record?.name);
    }
  }, [form, data, setValue]);
  return (
    <Form
      form={form}
      layout="vertical"
      size="large"
      initialValues={{ name: data?.record?.name, id: data?.record?.id }}
      onFinish={handleSubmit(handleFormSubmit)}
    >
      <InputCustom
        label="Vị trí"
        name="name"
        placeholder="Vị trí"
        control={control}
        errorMessage={errors?.name?.message?.toString()}
      />
      <div className="flex gap-2 justify-end">
        <Button
          size="middle"
          onClick={() => setSelectedPosition({ show: false })}
        >
          Hủy
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          size="middle"
          loading={
            addPositionMutation.isLoading || updatePositionMutation.isLoading
          }
        >
          {data?.status === FormStatus.UPDATE ? "Cập nhật" : "Thêm"}
        </Button>
      </div>
    </Form>
  );
};

export default AddPositionForm;

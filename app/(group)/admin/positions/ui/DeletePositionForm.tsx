import { App, Button, Form } from 'antd';
import React from 'react';
import { useMutation } from 'react-query';

import positionService from '@/services/positionService';
import { TPosition, TSelectedPosition } from '@/types/postionType';

type TDeletePositionForm = {
  data?: TPosition;
  setSelectedPosition: React.Dispatch<React.SetStateAction<TSelectedPosition>>;
  refreshPositionsData: () => void;
};

const DeletePositionForm: React.FC<TDeletePositionForm> = ({
  data,
  setSelectedPosition,
  refreshPositionsData,
}) => {
  const [form] = Form.useForm<TPosition>();
  const { message } = App.useApp();
  const deletePositionMutation = useMutation({
    mutationFn: (id: number) => {
      return positionService.deletePosition(id);
    },
    onSuccess: () => {
      message.success("Đã xoá vị trí");
      setSelectedPosition({ show: false });
      refreshPositionsData();
    },
    onError: () => {
      message.error("Đã có lỗi xảy ra. Vui này thử lại");
    },
  });

  if (!data?.id) return null;

  return (
    <Form
      form={form}
      onFinish={() => deletePositionMutation.mutate(data.id!)}
      initialValues={{ id: data?.id, name: data?.name }} // Set initial form values
    >
      <p>
        Bạn có muốn xóa vị trí <span className="font-bold">{data?.name}</span>{" "}
        không?
      </p>

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
          danger
          size="middle"
          loading={deletePositionMutation.isLoading}
        >
          Xóa
        </Button>
      </div>
    </Form>
  );
};

export default DeletePositionForm;

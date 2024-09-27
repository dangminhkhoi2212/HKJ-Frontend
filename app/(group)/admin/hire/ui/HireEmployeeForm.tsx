import { App, Button, DatePicker, Empty, Form, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { DATE_FORMAT } from "@/const/key";
import { hireService } from "@/services";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import SelectAccountForm from "@/shared/FormSelect/AccountForm/SelectAccountForm";
import { SelectePositionForm } from "@/shared/FormSelect/SelectePositionForm";
import { TAccountInfo } from "@/types";
import { THire } from "@/types/hireType";
import { TPosition } from "@/types/postionType";
import { cn } from "@/utils";
import { hireEmployeeSchema } from "@/validations/hireEmployee";
import { yupResolver } from "@hookform/resolvers/yup";

import EmployeeInfo from "../../../../../shared/FormSelect/AccountForm/AccountDisplay";

const { RangePicker } = DatePicker;

const defaultSalary: number = 0;
export type TSelectedPositionHire = {
  show: boolean;
  record?: TPosition;
};
const initSelectedPositionHire: TSelectedPositionHire = {
  show: false,
};
export type TSelectedEmployeeHire = {
  show: boolean;
  record?: any;
};
const initSelectedEmployeeHire: TSelectedEmployeeHire = {
  show: false,
};

const HireEmployeeForm = () => {
  const [form] = Form.useForm();

  const [selectedPosition, setSeletedPosition] =
    useState<TSelectedPositionHire>(initSelectedPositionHire);

  const [selectedEmployee, setSelectedEmployee] =
    useState<TSelectedEmployeeHire>(initSelectedEmployeeHire);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(hireEmployeeSchema),
    reValidateMode: "onChange",
    defaultValues: {
      beginSalary: defaultSalary.toString(),
    },
  });

  const { message } = App.useApp();
  const handleHireEmployee = (data: any) => {
    const dataMapper: THire = {
      ...data,
      beginDate: dayjs(data.beginDate).format(),
      endDate: dayjs(data.endDate).format(),
      position: {
        id: parseInt(data.position),
      },
      employee: {
        id: data.employee,
      },
    } as THire;
    createHireMutation.mutate(dataMapper);
  };
  const createHireMutation = useMutation({
    mutationFn: (data: THire) => {
      return hireService.create(data);
    },
    onSuccess(data, variables, context) {
      resetForm();
      message.success("Đã tạo dữ liệu thuê thành công");
    },
    onError: (error) => {
      console.log("🚀 ~ createHireMutation ~ error:", error);
      message.success("Đã có lỗi xảy ra xin vui lòng thử lại");
    },
  });
  const resetForm = () => {
    setSeletedPosition(initSelectedPositionHire);
    setSelectedEmployee(initSelectedEmployeeHire);
    reset();
  };
  useEffect(() => {
    if (selectedPosition?.record)
      setValue("position", selectedPosition?.record?.id!.toString()!, {
        shouldValidate: true,
      });
  }, [selectedPosition, setValue]);
  useEffect(() => {
    if (selectedEmployee?.record)
      setValue("employee", selectedEmployee?.record?.id.toString()!, {
        shouldValidate: true,
      });
  }, [selectedEmployee, setValue]);

  const handleSelectEmployee = () => {
    setSelectedEmployee({ show: true, record: null });
  };

  return (
    <div>
      <Modal
        open={selectedPosition.show}
        title="Danh sách vị trí"
        closable
        onCancel={() => setSeletedPosition(initSelectedPositionHire)}
        footer={null}
      >
        <SelectePositionForm
          onChange={(data: TPosition) =>
            setSeletedPosition({ show: false, record: data })
          }
        />
      </Modal>
      <Modal
        open={selectedEmployee.show}
        title="Danh sách nhân viên"
        closable
        onCancel={() => setSelectedEmployee(initSelectedEmployeeHire)}
        footer={null}
      >
        <SelectAccountForm
          onChange={(data: TAccountInfo) => {
            setSelectedEmployee({ show: false, record: data });
          }}
        />
      </Modal>
      {/* ############################## */}
      <Form
        onFinish={handleSubmit(handleHireEmployee)}
        form={form}
        layout="vertical"
        validateTrigger="onChange"
      >
        <div className="grid grid-cols-1 md:gird-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 place-items-stretch ">
          <div className="col-span-2 grid grid-cos-1 gap-4 place-self-start">
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Form.Item
                    label={<LabelCustom label="Thời gian làm việc" required />}
                    help={
                      errors?.date?.startDate?.message ||
                      errors?.date?.endDate?.message
                    }
                    validateStatus={
                      errors?.date?.startDate?.message ||
                      errors?.date?.endDate?.message
                        ? "error"
                        : ""
                    }
                  >
                    <RangePicker
                      allowClear={false}
                      value={
                        field.value
                          ? [
                              dayjs(field.value.startDate),
                              dayjs(field.value.endDate),
                            ]
                          : undefined
                      } // Handle value
                      onChange={(dates) => {
                        if (dates)
                          field.onChange({
                            startDate: dates![0],
                            endDate: dates![1],
                          });
                      }}
                      size="large"
                      className="w-80"
                      placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                      format={DATE_FORMAT}
                    />
                  </Form.Item>
                );
              }}
            />

            <div className="flex flex-col gap-2">
              <InputCustom
                label="Lựa chọn vị trí làm việc"
                required={true}
                readOnly
                type="textarea"
                name="position"
                value={selectedPosition.record?.name}
                errorMessage={errors?.position?.message}
                control={control}
                placeholder="Ví trí làm việc"
                className="w-80"
                extra={
                  <Button
                    size="small"
                    className="mt-2"
                    onClick={() => setSeletedPosition({ show: true })}
                  >
                    {selectedPosition.record ? "Thay đổi" : "Lựa chọn"}
                  </Button>
                }
              />
            </div>

            <InputCustom
              label="Mức lương khởi điểm"
              name="beginSalary"
              className="w-full"
              control={control}
              errorMessage={errors?.beginSalary?.message}
              type="price"
            />
          </div>

          <div className="col-span-3">
            <LabelCustom label="Tài khoản nhân viên" classname="" required />
            {selectedEmployee.record ? (
              <div>
                <Button
                  className="my-2"
                  onClick={() =>
                    setSelectedEmployee({ show: true, record: null })
                  }
                >
                  Thay đổi
                </Button>
                {selectedEmployee.record && (
                  <EmployeeInfo account={selectedEmployee.record} />
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "ring-1 ring-gray-300 rounded-md p-2 h-full flex flex-col justify-center",
                  errors?.employee?.message ? "ring-rose-400" : ""
                )}
              >
                <Empty
                  description={
                    errors?.employee?.message && (
                      <span className="text-red-400">Không bỏ trống ô này</span>
                    )
                  }
                >
                  <Button onClick={() => handleSelectEmployee()}>
                    Chọn tài khoản
                  </Button>
                </Empty>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <InputCustom
          label="Ghi chú"
          name="note"
          formItemClassName="mt-4"
          required={false}
          showCount
          control={control}
          type="textarea"
          count={{ max: 300 }}
        />
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={createHireMutation.isLoading}
          >
            Bắt đầu thuê
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default HireEmployeeForm;

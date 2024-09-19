import { DATE_FORMAT } from "@/const/key";
import InputCustom from "@/shared/InputCustom";
import LabelCustom from "@/shared/InputCustom/LabelCustom";
import { TPosition } from "@/types/postion.type";
import { hireEmployeeSchema } from "@/validations/hireEmployee.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DatePicker, Empty, Form, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import EmployeeInfo from "./EmployeeInfo";
import PositoinOption from "./PositoinOption";
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
  console.log("🚀 ~ HireEmployeeForm ~ selectedPosition:", selectedPosition);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(hireEmployeeSchema),
    reValidateMode: "onChange",
  });
  console.log("🚀 ~ HireEmployeeForm ~ errors:", errors);

  const handleHireEmployee = (data: any) => {
    console.log("🚀 ~ data:", data);
  };

  useEffect(() => {
    if (selectedPosition?.record)
      setValue("position", selectedPosition?.record?.id.toString()!, {
        shouldValidate: true,
      });
  }, [selectedPosition, setValue]);
  return (
    <div>
      <Modal
        open={selectedPosition.show}
        title="Danh sách vị trí"
        closable
        onCancel={() => setSeletedPosition(initSelectedPositionHire)}
        footer={null}
      >
        <PositoinOption setSeletedPosition={setSeletedPosition} />
      </Modal>
      {/* <Modal
        open={selectedEmployee.show}
        title="Danh sách nhân viên"
        closable
        onCancel={() => setSelectedEmployee(initSelectedEmployeeHire)}
        footer={null}
      ></Modal> */}
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
              control={control}
              errorMessage={errors?.beginSalary?.message}
              defaultValue={defaultSalary}
              type="price"
            />
          </div>

          <div className="col-span-3">
            <LabelCustom label="Tài khoản nhân viên" classname="" required />
            {selectedEmployee.show ? (
              <div>
                <Button className="my-2">Thay đổi</Button>
                <EmployeeInfo />
              </div>
            ) : (
              <div className="ring-1 rounded-md p-2 h-full flex flex-col justify-center">
                <Empty>
                  <Button onClick={() => setSelectedEmployee({ show: true })}>
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
          <Button type="primary" htmlType="submit">
            Bắt đầu thuê
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default HireEmployeeForm;

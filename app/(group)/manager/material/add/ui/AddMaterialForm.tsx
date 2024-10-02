"use client";
import { Button, Divider, Form, Result, Space, Steps, UploadFile } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useMutation } from "react-query";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { materialImageService, materialService } from "@/services";
import {
  InputCustom,
  InputNumberCustom,
  LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { TImageUpload, TMaterial, TMaterialAdd } from "@/types";
import { TMaterialImage, TMaterialImageAdd } from "@/types/materialImageType";
import materialValidation from "@/validations/materialValidation";
import { yupResolver } from "@hookform/resolvers/yup";

const items = [
  {
    title: "Điền thông tin",
  },
  {
    title: "Chọn hình ảnh",
  },
  {
    title: "Kết quả",
  },
];
type TForm = TMaterialAdd & {
  images: TImageUpload[];
};
const initValueForm: TForm = {
  name: "",
  unit: "",
  unitPrice: 0,
  quantity: 0,
  supplier: "",
  coverImage: "",
  isDeleted: false,
  images: [],
};
export const extraUnitPrice = ({
  unitPrice,
  unit,
}: {
  unitPrice: number;
  unit: string;
}) => {
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

const AddMaterialForm = () => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<UploadFile[]>([]);
  const [coverImage, setCoverImage] = useState<UploadFile[]>([]);
  const [current, setCurrent] = useState(0);
  const { router } = useRouterCustom();

  const {
    getValues,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TForm>({
    resolver: yupResolver(materialValidation.materialSchema),
    mode: "onChange",
    defaultValues: initValueForm,
  });
  console.log("🚀 ~ AddMaterialForm ~ errors:", errors);
  const next = () => {
    setCurrent(current + 1);
  };
  const handleNext = async () => {
    if (await trigger(["name", "unit", "unitPrice", "quantity", "supplier"]))
      next();
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChangeInputImage = (newFileList: UploadFile[], file: UploadFile) => {
    setImages(newFileList);
    const imagesForm: TImageUpload[] = newFileList.map((item) => {
      return { url: item.url! };
    });
    console.log("🚀 ~ onChangeInputImage ~ imagesForm:", imagesForm);
    setValue("images", imagesForm, { shouldValidate: true });
  };
  const onChangeInputCoverImage = async (
    newFileList: UploadFile[],
    file: UploadFile
  ) => {
    setCoverImage(newFileList);
    const imagesForm: TImageUpload[] = newFileList?.map((item) => {
      return { url: item.url! };
    });
    console.log("🚀 ~ onChangeInputCoverImage ~ imagesForm:", imagesForm);
    setValue("coverImage", imagesForm[0]?.url!, { shouldValidate: true });
  };

  const createMaterialMutation = useMutation({
    mutationFn: (data: TMaterialAdd) => {
      return materialService.create(data);
    },
    onSuccess: () => {
      next();
    },
    onError: (error) => {
      console.log("🚀 ~ createMaterialMutation ~ error:", error);
    },
  });

  const handleCreateMaterialImages = async (
    images: TMaterialImageAdd[]
  ): Promise<TMaterialImage[]> => {
    try {
      // Check if imagesCreate is defined and has items
      if (images && images.length > 0) {
        const resultCreateImages = await Promise.all(
          images.map(async (item) => {
            return await materialImageService.create({
              ...item,
              isDeleted: false,
              material: { id: item.material?.id },
            });
          })
        );
        return resultCreateImages;
      }
      return [];
    } catch (error) {
      console.error("Error in handleCreateMaterial:", error);
      return [];
    }
  };
  const handleCreateMaterial = async (data: TForm) => {
    const { images: _, ...rest } = data;
    let material: TMaterial = await createMaterialMutation.mutateAsync(rest);

    const imageConvert: TMaterialImageAdd[] = data.images.map((item) => {
      return {
        ...item,
        material,
      };
    });
    console.log(
      "🚀 ~ constimageConvert:TMaterialImage[]=data.images.map ~ imageConvert:",
      imageConvert
    );
    const images: TMaterialImage[] = await handleCreateMaterialImages(
      imageConvert
    );
    console.log("🚀 ~ handleCreateMaterial ~ convertData:", images);
  };

  const resetForm = () => {
    const { images, ...rest } = initValueForm;
    const imagesForm = getValues("images");
    reset(rest);
    setValue("images", imagesForm);
  };

  const steps = [
    {
      key: "1",
      children: (
        <div className="grid grid-cols-2 gap-8">
          <Space direction="vertical">
            <InputCustom
              control={control}
              name="name"
              label="Tên loại nguyên liệu"
              errorMessage={errors.name?.message}
            />
            <InputNumberCustom
              control={control}
              name="quantity"
              label="Số lượng nhập"
              max={1000000}
              min={0}
              errorMessage={errors.quantity?.message}
            />
            <InputCustom
              control={control}
              name="unit"
              label="Đơn vị"
              errorMessage={errors.unit?.message}
            />
          </Space>

          <Space direction="vertical">
            <div>
              <InputNumberCustom
                control={control}
                name="unitPrice"
                suffix=" VND"
                label="Giá mỗi đơn vị"
                defaultValue={0}
                extra={
                  <Space direction="vertical" size={"small"}>
                    <NumberToWords number={getValues("unitPrice")} />
                    <span>Ví dụ: 500,000/ gam</span>
                    {extraUnitPrice({
                      unit: watch("unit"),
                      unitPrice: watch("unitPrice"),
                    })}
                  </Space>
                }
                errorMessage={errors.unitPrice?.message}
              />
            </div>
            <InputCustom
              control={control}
              name="supplier"
              label="Nhà cung cấp"
              errorMessage={errors.supplier?.message}
            />
          </Space>
        </div>
      ),
    },
    {
      key: "2",
      children: (
        <div className="">
          <Space direction="vertical">
            <LabelCustom label="Ảnh bìa" required />
            <InputImage
              onChange={async (fileList, file) =>
                await onChangeInputCoverImage(fileList, file)
              }
              images={coverImage}
              maxCount={1}
            />
            <span className="text-red-500">
              {errors?.coverImage?.message ?? ""}
            </span>
          </Space>
          <Divider className="my-2" />
          <Space direction="vertical">
            <LabelCustom label="Hình ảnh" required />
            <InputImage
              onChange={onChangeInputImage}
              images={images}
              maxCount={5}
            />
            <span className="text-red-500">
              {errors?.images?.message ??
                errors?.images?.[0]?.url?.message ??
                ""}
            </span>
          </Space>
        </div>
      ),
    },
    {
      Key: "3",
      children: (
        <Result
          status="success"
          title="Đã thêm thành công"
          extra={[
            <Button type="dashed" key="1" onClick={() => goToNewForm()}>
              Thêm sản phẩm mới
            </Button>,
            <Button
              type="primary"
              key="2"
              onClick={() => router.push(routesManager.material)}
            >
              Tới trang chất liệu
            </Button>,
          ]}
        />
      ),
    },
  ];
  const goToNewForm = () => {
    reset(initValueForm);
    setImages([]);
    setCurrent(0);
  };

  return (
    <div>
      <Steps current={current} items={items} />
      <Form
        form={form}
        layout="vertical"
        className=""
        onFinish={handleSubmit(handleCreateMaterial)}
      >
        <div className="my-6">{steps[current].children!}</div>
        <Space className="flex justify-end">
          {current < steps.length - 2 && (
            <Space>
              <Button type="default" onClick={resetForm}>
                Xóa dữ liệu
              </Button>
              <Button type="primary" onClick={() => handleNext()}>
                Kế tiếp
              </Button>
            </Space>
          )}
          {current > 0 && current <= steps.length - 2 && (
            <Button
              style={{ margin: "0 8px" }}
              onClick={() => prev()}
              disabled={createMaterialMutation.isLoading}
            >
              Quay lại
            </Button>
          )}
          {current === steps.length - 2 && (
            <Button
              type="primary"
              htmlType="submit"
              loading={createMaterialMutation.isLoading}
            >
              Tạo
            </Button>
          )}
        </Space>
      </Form>
    </div>
  );
};

export default AddMaterialForm;

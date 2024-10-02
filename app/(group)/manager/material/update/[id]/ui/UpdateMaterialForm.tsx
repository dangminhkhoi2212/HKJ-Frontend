"use client";
import { App, Button, Divider, Form, Space } from "antd";
import { UploadFile } from "antd/lib";
import React, { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { materialImageService, materialService } from "@/services";
import {
  InputCustom,
  InputNumberCustom,
  LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import {
  TImageUpload,
  TMaterial,
  TMaterialImage,
  TMaterialUpadate,
} from "@/types";
import materialValidation from "@/validations/materialValidation";
import { yupResolver } from "@hookform/resolvers/yup";

import { extraUnitPrice } from "../../../add/ui/AddMaterialForm";

type Props = {
  id: number;
};
type TForm = TMaterialUpadate & { images: TImageUpload[] };
const defaultValue: TForm = {
  id: 0,
  name: "",
  quantity: 0,
  unit: "",
  unitPrice: 0,
  supplier: "",
  coverImage: "",
  images: [],
};
const UpdateMaterialForm: React.FC<Props> = ({ id }) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues: defaultValue,
    resolver: yupResolver(materialValidation.materialUpdateSchema),
  });
  const [form] = Form.useForm();
  const [images, setImages] = useState<UploadFile<TMaterialImage>[]>([]);
  console.log("🚀 ~ images:", images);
  const [coverImage, setCoverImage] = useState<UploadFile<TMaterialImage>[]>(
    []
  );
  const [oldData, setOldData] = useState<TMaterial>({} as TMaterial);
  const uid = useId();
  const { message } = App.useApp();

  const getMaterialQuery = useQuery({
    queryKey: ["getMaterial", id],
    queryFn: () => materialService.getOne({ id }),
    onSuccess(data: TMaterial) {
      console.log("🚀 ~ onSuccess ~ data:", data);
      setOldData(data);
      setValue("id", data.id);
      setValue("unitPrice", data.unitPrice);
      setValue("coverImage", data.coverImage);
      setValue("supplier", data.supplier);
      setValue("unit", data.unit);
      setValue("name", data.name);
      setValue("quantity", data.quantity);
      setValue("images", data.images);
      setValue("unitPrice", data.unitPrice);
      setImages(
        data.images.map(
          (image) =>
            ({
              uid: image.id?.toString() || uid,
              url: image.url,
              name: "images",
            } as UploadFile)
        )
      );
      setCoverImage([{ url: data.coverImage, uid: uid, name: "coverImage" }]);
    },
  });
  const onChangeInputImage = (newFileList: UploadFile[], file: UploadFile) => {
    console.log("🚀 ~ onChangeInputImage ~ newFileList:", newFileList);
    const imagesForm: TImageUpload[] = newFileList.map((item) => {
      return { url: item.url! };
    });
    setImages(newFileList);
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

  const handleUpdateMaterialImages = async (
    newImages: TImageUpload[]
  ): Promise<TMaterialImage[]> => {
    try {
      // Check if imagesCreate is defined and has items
      if (images && images.length > 0) {
        //delete old images
        const imagesDelete: TMaterialImage[] = oldData.images.filter(
          (item) => !newImages.some((oldData) => oldData.url === item.url)
        );
        console.log("🚀 ~ imagesDelete:", imagesDelete);

        const deleteOldImages = await Promise.all(
          imagesDelete.map(async (item) => {
            return await materialImageService.deleteOne(item?.id!);
          })
        );
        // //create new images
        const newImagesNeedUpdate: TImageUpload[] = newImages.filter(
          (item) => !oldData.images.some((oldData) => oldData.url === item.url)
        );
        console.log("🚀 ~ newImagesNeedUpdate:", newImagesNeedUpdate);
        const createNewImages = await Promise.all(
          newImagesNeedUpdate.map(async (item) => {
            return await materialImageService.create({
              url: item?.url!,
              material: { id: oldData.id },
            });
          })
        );
        // return createNewImages;
      }
      return [];
    } catch (error) {
      console.error("Error in handleCreateMaterial:", error);
      return [];
    }
  };

  useEffect(() => {
    getMaterialQuery.refetch();
  }, []);

  const updateMaterialMutation = useMutation({
    mutationFn: (data: TMaterialUpadate) => {
      return materialService.update(data);
    },
  });
  const handleUpdate = async (data: TForm) => {
    console.log("🚀 ~ handleUpdate ~ data:", data);
    const { images, ...rest } = data;

    updateMaterialMutation.mutate({
      ...rest,
    });
    await handleUpdateMaterialImages(images);
  };

  const updateMutation = useMutation({
    mutationFn: (data: TForm) => {
      return handleUpdate(data);
    },
    onSuccess(data) {
      message.success("Đã cập nhật");
    },
    onError() {
      message.error("Cập nhật thất bại");
    },
  });
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        className=""
        onFinish={handleSubmit((data) => updateMutation.mutate(data))}
      >
        <div className="grid grid-cols-2 gap-8">
          <Space direction="vertical" size={"middle"}>
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

          <Space direction="vertical" size={"middle"}>
            <div>
              <InputNumberCustom
                control={control}
                name="unitPrice"
                suffix=" VND"
                label="Giá mỗi đơn vị"
                defaultValue={0}
                extra={
                  <Space direction="vertical">
                    <span>Ví dụ: 500,000/ gam</span>
                    {extraUnitPrice({
                      unitPrice: getValues("unitPrice"),
                      unit: getValues("unit"),
                    })}
                  </Space>
                }
                errorMessage={errors.unitPrice?.message}
              />
              <NumberToWords number={getValues("unitPrice")} />
            </div>
            <InputCustom
              control={control}
              name="supplier"
              label="Nhà cung cấp"
              errorMessage={errors.supplier?.message}
            />
          </Space>
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
                maxCount={30}
              />
              <span className="text-red-500">
                {errors?.images?.message ??
                  errors?.images?.[0]?.url?.message ??
                  ""}
              </span>
            </Space>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isLoading}
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateMaterialForm;

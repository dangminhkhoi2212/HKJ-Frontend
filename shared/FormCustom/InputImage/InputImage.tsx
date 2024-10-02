import { Image, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadFileStatus } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { imageService } from "@/services";
import { TImageResponse } from "@/services/imageService";
import { PlusOutlined } from "@ant-design/icons";

import type { GetProp, UploadFile, UploadProps } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export type UploadRequestOption<T = any> = Parameters<
  Exclude<UploadProps<T>["customRequest"], undefined>
>[0];
type TProps = {
  images?: UploadFile[];
  maxCount?: number;
  onChange?: (newFileList: UploadFile[], file: UploadFile<any>) => void;
  onRemove?: (file: UploadFile<any>) => void;
};
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const InputImages: React.FC<TProps> = ({
  images = [],
  onChange,
  onRemove,
  maxCount = 8,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (images && images.length > 0) setFileList([...images]);
  }, [images]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
    event,
  }) => {
    console.log("🚀 ~ event:", event);
    setFileList(newFileList);
    if (onChange) onChange(newFileList, file);
  };
  const updateFileStatus = (file: UploadFile, status: UploadFileStatus) => {
    setFileList((pre) => [
      ...pre.map((f) => (f.uid === file.uid ? { ...f, status } : f)),
    ]);
  };
  const handleOnRemove: UploadProps["onRemove"] = async (file) => {
    try {
      const listImage: string[] = [file.url!];
      updateFileStatus(file, "uploading");

      const response = await imageService.deleteImages(listImage);
      if (response.success) {
        if (onRemove) onRemove(file);
        updateFileStatus(file, "removed");
      } else {
        updateFileStatus(file, "done");
      }
    } catch (error) {
      updateFileStatus(file, "error");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const updaloadImageMutation = useMutation({
    mutationFn: (file: File) => imageService.upload(file),
  });
  const customRequest = async (options: UploadRequestOption) => {
    const { onSuccess, onError, file, onProgress, method, action } = options;

    try {
      const response: TImageResponse = await updaloadImageMutation.mutateAsync(
        file as File
      );
      (file as UploadFile).url = response.url;
      onSuccess && onSuccess({ url: response.url });
    } catch (error) {
      onError && onError(error as any);
    }
  };

  return (
    <div>
      <ImgCrop rotationSlider zoomSlider aspectSlider showReset>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={handleOnRemove}
          customRequest={customRequest}
        >
          {fileList?.length >= maxCount ? null : uploadButton}
        </Upload>
      </ImgCrop>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          alt={previewImage}
        />
      )}
    </div>
  );
};

export default InputImages;

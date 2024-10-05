import { UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";

import { TImage } from "@/types";

class ImageUtil {
  getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  updateImageMapper(
    changedImages: UploadFile[],
    currentImages: TImage[]
  ): {
    newImagesUpdate: UploadFile[];
    keepImages: TImage[];
    imagesDelete: TImage[];
  } {
    const newImagesUpdate: UploadFile[] = changedImages.filter(
      (newImage) => !newImage?.url
    );
    const keepImages: TImage[] = changedImages
      .filter((image) => image?.url!)
      .map((image) => ({ id: Number.parseInt(image.uid), url: image.url! }));
    const imagesDelete = currentImages.filter(
      (image) => !keepImages.some((newImage) => newImage.url === image.url)
    );

    return { newImagesUpdate, keepImages, imagesDelete };
  }
  convertToUploadFile(image: { id?: number; url: string }): UploadFile {
    return {
      uid: image.id?.toString() ?? uuidv4(),
      name: image.url.split("/").pop() || "image",
      status: "done",
      url: image.url,
    };
  }
}
const imageUtil = new ImageUtil();
export default imageUtil;

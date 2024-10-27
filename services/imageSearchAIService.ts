import axios, { AxiosInstance } from "axios";

import { TImageSearchAI, TImageSearchAIResponse } from "@/types";

class ImageSearchAIService {
	private static instance: ImageSearchAIService;
	private interceptor: AxiosInstance;

	private constructor() {
		this.interceptor = axios.create({
			baseURL: process.env.NEXT_PUBLIC_SERVER_AI,
		});
	}

	public static getInstance(): ImageSearchAIService {
		if (!ImageSearchAIService.instance) {
			ImageSearchAIService.instance = new ImageSearchAIService();
		}
		return ImageSearchAIService.instance;
	}

	async imageToVector(
		data: TImageSearchAI[]
	): Promise<TImageSearchAIResponse> {
		return (await this.interceptor.post("/extract-image", { images: data }))
			.data;
	}
	async searchImage(file: File): Promise<TImageSearchAIResponse> {
		const formData = new FormData();
		formData.append("file", file);

		return (
			await this.interceptor.post("/search-image", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		).data;
	}
	async removeImages(imageIds: number[]): Promise<TImageSearchAIResponse> {
		return (
			await this.interceptor.post(`/extract-image/remove`, {
				images: imageIds,
			})
		).data;
	}
}
export default ImageSearchAIService.getInstance();

import { UploadFile } from "antd/lib";

import { getSupbaseInstance } from "@/config";

// Types
type FolderName =
	| "materials"
	| "projects"
	| "orders"
	| "tasks"
	| "jewelry-models";

interface UploadResult {
	id: string;
	path: string;
	fullPath: string;
	publicUrl: string;
}

interface StorageConfig {
	bucket: string;
	defaultContentType: string;
}

class SupabaseStorageService {
	client;
	private config: StorageConfig;
	private static instance: SupabaseStorageService;
	constructor() {
		this.client = getSupbaseInstance();
		this.config = {
			bucket: "images",
			defaultContentType: "image/png",
		};
	}
	public static getInstance(): SupabaseStorageService {
		if (!SupabaseStorageService.instance) {
			SupabaseStorageService.instance = new SupabaseStorageService();
		}
		return SupabaseStorageService.instance;
	}
	/**
	 * Generates a unique filename with extension
	 */
	private generateFileName(originalName: string): string {
		const extension = originalName.split(".").pop() || "png";
		return `${Date.now()}.${extension}`;
	}

	/**
	 * Creates a full path for storage
	 */
	private createPath(folder: string, fileName: string): string {
		return `${folder}/${fileName}`.replace(/\/+/g, "/");
	}
	private createPathByUrl(folder: string, url: string) {
		const name = url.split("/")[-1];
		return `${folder}/${name}`.replace(/\/+/g, "/");
	}
	/**
	 * Gets public URL for a file
	 */
	private async getPublicUrl(path: string): Promise<string> {
		const {
			data: { publicUrl },
		} = await this.client.storage
			.from(this.config.bucket)
			.getPublicUrl(path);
		return publicUrl;
	}

	/**
	 * Upload a file to Supabase storage
	 */
	async uploadFile(file: File, folder: string): Promise<UploadResult> {
		try {
			const fileName = this.generateFileName(file.name);
			const path = this.createPath(folder, fileName);
			const fileContent = await file.arrayBuffer();

			const { data, error } = await this.client.storage
				.from(this.config.bucket)
				.upload(path, fileContent, {
					contentType: file.type || this.config.defaultContentType,
					cacheControl: "3600",
					upsert: false,
				});

			if (error) throw new Error(`Upload failed: ${error.message}`);
			if (!data) throw new Error("Upload failed: No data returned");

			const publicUrl = await this.getPublicUrl(path);

			return {
				id: data.id,
				path: data.path,
				fullPath: `${this.config.bucket}/${data.path}`,
				publicUrl,
			};
		} catch (error) {
			console.error("File upload error:", error);
			throw this.handleError(error);
		}
	}

	/**
	 * Extracts the filename from a path
	 * @param path the path to extract the filename from
	 * @returns the filename, or an empty string if no filename is present
	 */
	private getFileNameFromPath(path: string): string {
		return path.split("/").pop() || "";
	}

	/**
	 * Removes leading and trailing slashes from a path
	 * @param path the path to normalize
	 * @returns the normalized path
	 */
	private normalizePath(path: string): string {
		return path.replace(/^\/+|\/+$/g, "");
	}
	/**
	 * Delete images from a folder that are not in the provided list
	 */
	async deleteImages(
		keepImages: string[],
		folder: string
	): Promise<string[]> {
		try {
			if (!keepImages?.length) {
				throw new Error("No image URLs provided for deletion filter");
			}

			// Normalize the keep list to just filenames
			const keepFilenames = keepImages.map((path) =>
				this.getFileNameFromPath(path)
			);
			console.log("Keep filenames:", keepFilenames);

			const { data: files, error: listError } = await this.client.storage
				.from(this.config.bucket)
				.list(this.normalizePath(folder));

			if (listError) throw listError;
			if (!files) return [];

			console.log(
				"Files in folder:",
				files.map((f) => f.name)
			);

			// Filter files to delete by comparing just the filenames
			const imagesToDelete = files
				.filter((file) => !keepFilenames.includes(file.name))
				.map((file) => this.createPath(folder, file.name));

			console.log("Files to delete:", imagesToDelete);

			if (!imagesToDelete.length) return [];

			const { error: deleteError } = await this.client.storage
				.from(this.config.bucket)
				.remove(imagesToDelete);

			if (deleteError) throw deleteError;

			return imagesToDelete;
		} catch (error) {
			console.error("Image deletion error:", error);
			throw this.handleError(error);
		}
	}
	async deleteOne(url: string, folder: string) {
		await this.client.storage
			.from("images")
			.remove([this.createPathByUrl(folder, url)]);
	}
	async deleteMultiple(imageUrls: string[], folder: string) {
		await Promise.all(
			imageUrls.map(
				async (url) =>
					await this.deleteOne(
						this.createPathByUrl(folder, url),
						folder
					)
			)
		);
	}
	/**
	 * Create folder path for cover images
	 */
	createCoverFolder(folderName: FolderName, id: number | string): string {
		return `${folderName}/${id}/cover`;
	}

	/**
	 * Create folder path for multiple images
	 */
	createImagesFolder(folderName: FolderName, id: number | string): string {
		return `${folderName}/${id}/images`;
	}

	/**
	 * Standardized error handling
	 */
	private handleError(error: unknown): Error {
		if (error instanceof Error) {
			return new Error(`Storage operation failed: ${error.message}`);
		}
		return new Error("An unknown error occurred during storage operation");
	}

	async uploadAnDelete(
		keepImages: string[],
		newImages: File[],
		folder: string
	): Promise<string[]> {
		const imagesUpload = await Promise.all(
			newImages.map(async (file) => {
				return await this.uploadFile(file, folder);
			})
		);
		console.log(
			"🚀 ~ SupabaseStorageService ~ imagesUpload:",
			imagesUpload
		);

		const keepImagesUrl = [
			...imagesUpload.map((img) => img.publicUrl),
			...keepImages,
		];
		console.log(
			"🚀 ~ SupabaseStorageService ~ keepImagesUrl:",
			keepImagesUrl
		);
		await this.deleteImages(keepImagesUrl, folder);
		return [...imagesUpload.map((img) => img.publicUrl)];
	}
	async uploadMultiple(
		images: UploadFile[],
		folder: string
	): Promise<string[]> {
		const urls = await Promise.all(
			images.map(async (file) => {
				return await this.uploadFile(this.convertFile(file), folder);
			})
		);
		return urls.map((img) => img.publicUrl);
	}

	convertFile(file: UploadFile): File {
		return new File([file.originFileObj!], file.name, {
			type: file.type,
		});
	}
}

// Create and export a singleton instance
const supabaseService = SupabaseStorageService.getInstance();

export default supabaseService;

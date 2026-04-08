import api from "@/lib/axios";

const CHUNK_SIZE = 5 * 1024 * 1024;

type UploadMeta = {
	file: File;
	ownerType: string;
	ownerId?: string;
	fileType: string;
};

type UploadInitResponse = {
	uploadId: string;
	chunkSize: number;
	totalChunks: number;
	status: "creating";
};

type UploadCompleteData = {
	_id: string;
	url: string;
	status: "completed";
	uploadId: string;
};

const unwrapData = <T>(responseData: unknown): T => {
	const payload = responseData as { data?: T };
	return (payload?.data ?? responseData) as T;
};

export const uploadFileByChunks = async (
	meta: UploadMeta,
): Promise<UploadCompleteData> => {
	const initRes = await api.post("/api/v1/files/uploads/init", {
		fileName: meta.file.name,
		totalSize: meta.file.size,
		mimeType: meta.file.type || "application/octet-stream",
		ownerType: meta.ownerType,
		ownerId: meta.ownerId || "unknown",
		fileType: meta.fileType,
	});
	const initData = unwrapData<UploadInitResponse>(initRes.data);
	const totalChunks = initData.totalChunks;
	const chunkSize = initData.chunkSize || CHUNK_SIZE;

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
		const start = chunkIndex * chunkSize;
		const end = Math.min(start + chunkSize, meta.file.size);
		const chunk = meta.file.slice(start, end);
		const formData = new FormData();
		formData.append("uploadId", initData.uploadId);
		formData.append("chunkIndex", String(chunkIndex));
		formData.append("chunk", chunk, `${meta.file.name}.part-${chunkIndex}`);
		await api.post("/api/v1/files/uploads/chunk", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	}

	const doneRes = await api.post("/api/v1/files/uploads/complete", {
		uploadId: initData.uploadId,
	});
	return unwrapData<UploadCompleteData>(doneRes.data);
};

import axios from 'axios';
import ObjectId from 'bson-objectid';

// helpers/uploadImage.js

async function uploadImage(
	file,
	bucketType = 'originals',
	customFileName = null,
	uploadPolicy,
	imageId,
	onUploadProgress = null, // 👈 Add this
) {
	try {
		if (!(file instanceof File)) {
			throw new Error('Invalid file: Please provide a valid File object');
		}

		const policy = uploadPolicy[bucketType];
		if (!policy) {
			throw new Error(`Invalid bucket type: ${bucketType}. Use 'optimized' or 'originals'`);
		}

		const expiresAt = new Date(policy.expiresAt);
		if (new Date() > expiresAt) {
			throw new Error(`Upload policy has expired at ${policy.expiresAt}`);
		}

		const epoch = Math.floor(Date.now() / 1000);
		const originalExt = file.name.split('.').pop().toLowerCase() || 'jpg';
		const fileName = customFileName || `${imageId.toHexString()}_${epoch}.${originalExt}`;
		const fileKey =
			bucketType === 'optimized'
				? `${policy.keyPrefix}optimized/${fileName}`
				: `${policy.keyPrefix}${fileName}`;

		const formData = new FormData();
		formData.append('Policy', policy.fields.Policy);
		formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
		formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
		if (policy.fields['X-Amz-Date']) {
			formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
		}
		formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
		if (bucketType === 'optimized' && policy.fields['x-amz-storage-class']) {
			formData.append('x-amz-storage-class', policy.fields['x-amz-storage-class']);
		}

		formData.append('key', fileKey);
		const contentType = originalExt === 'png' ? 'image/png' : 'image/jpeg';
		formData.append('Content-Type', contentType);
		formData.append('file', file);

		const uploadUrl = policy.url.trim();

		// ✅ Pass onUploadProgress to axios
		const response = await axios.post(uploadUrl, formData, {
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
			onUploadProgress: (progressEvent) => {
				if (onUploadProgress) {
					const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
					onUploadProgress(percent);
				}
			},
		});

		return {
			success: true,
			uploadUrl: `${policy.url}${fileKey}`,
			fileKey,
			bucketName: policy.bucketName,
			imageId: imageId.toHexString(),
			epoch,
			fileName,
		};
	} catch (error) {
		return {
			success: false,
			error: error.message,
			status: error.response?.status,
			data: error.response?.data,
		};
	}
}

export { uploadImage };

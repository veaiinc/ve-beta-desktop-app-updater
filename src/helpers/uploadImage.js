// helpers/uploadImage.js
import axios from 'axios';
import ObjectId from 'bson-objectid';

async function uploadImage(
	file,
	bucketType = 'originals', // ← now supports: 'originals', 'optimized', 'thumbnails_300w'
	customFileName = null,
	uploadPolicy,
	imageId,
	onUploadProgress = null,
	galleryId,
	versionId,
	tenantId,
	batchId,
) {
	try {
		if (!(file instanceof File)) {
			throw new Error('Invalid file: Please provide a valid File object');
		}

		// ✅ Support for 'thumbnails_300w'
		const policy = uploadPolicy[bucketType];
		console.log(policy, 'policy');

		if (!policy) {
			throw new Error(
				`Invalid bucket type: ${bucketType}. Use 'originals', 'optimized', or 'thumbnails_300w'`,
			);
		}

		const expiresAt = new Date(policy.expiresAt);
		if (new Date() > expiresAt) {
			throw new Error(`Upload policy has expired at ${policy.expiresAt}`);
		}

		const originalExt = file.name.split('.').pop().toLowerCase() || 'jpg';
		const fileName = customFileName || `${imageId.toHexString()}_${versionId}.${originalExt}`;

		// ✅ Generate fileKey based on bucketType
		let fileKey;
		if (bucketType === 'optimized') {
			fileKey = `${policy.keyPrefix}optimized/${fileName}`;
		} else if (bucketType === 'thumbnails_300w') {
			// 🔥 Important: Use 'thumbnails-300w/' with a hyphen, not underscore
			fileKey = `${policy.keyPrefix}thumbnails-300w/${fileName}`;
		} else {
			// 'originals'
			fileKey = `${policy.keyPrefix}${fileName}`;
		}

		const formData = new FormData();
		formData.append('Policy', policy.fields.Policy);
		formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
		formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
		if (policy.fields['X-Amz-Date']) {
			formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
		}
		formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);

		// ✅ Add storage class only for optimized (or thumbnails if needed)
		if (
			(bucketType === 'optimized' || bucketType === 'thumbnails_300w') &&
			policy.fields['x-amz-storage-class']
		) {
			formData.append('x-amz-storage-class', policy.fields['x-amz-storage-class']);
		}

		formData.append('key', fileKey);

		const contentType = originalExt === 'png' ? 'image/png' : 'image/jpeg';
		formData.append('Content-Type', contentType);
		formData.append('file', file);

		// ✅ Only add metadata for originals and optimized — skip for thumbnails
		if (bucketType === 'originals') {
			formData.append('x-amz-meta-gallery-id', galleryId);
			formData.append('x-amz-meta-given-image-id', imageId);
			formData.append('x-amz-meta-given-image-version-id', versionId);
			formData.append('x-amz-meta-is-ai-faces-enabled', true);
			formData.append('x-amz-meta-original-file-name', file?.name);
			formData.append('x-amz-meta-tenant-id', tenantId);
			formData.append('x-amz-meta-upload-batch-id', batchId);
		}

		const uploadUrl = policy.url.trim();

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
			fileKey, // ← This will be like: "prefix/thumbnails-300w/abc_123.jpg"
			bucketName: policy.bucketName,
			imageId: imageId.toHexString(),
			versionId,
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

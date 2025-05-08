import { useState, memo } from 'react';
import { Modal } from 'antd';
import { ReactComponent as DownloadIcon } from '../../../assets/svg/download.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/close.svg';
import '../../../assets/scss/forms/formPreview.scss';

const FormPreview = ({ file, onClose }) => {
	const [isModalVisible, setIsModalVisible] = useState(true);
	const { name, fileURL, type } = file || {};

	const handleClose = () => {
		setIsModalVisible(false);
		onClose?.();
	};

	const handleDownload = async () => {
		if (!fileURL) return;

		try {
			// Fetch the file
			const response = await fetch(fileURL);
			const blob = await response?.blob();

			// Create a blob URL
			const blobUrl = window?.URL?.createObjectURL(blob);

			// Create a temporary link element
			const link = document?.createElement('a');
			link.href = blobUrl;
			link.download = name || 'download';

			// Append to body, click, and remove
			document?.body?.appendChild(link);
			link.click();

			// Clean up
			document?.body?.removeChild(link);
			window?.URL?.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Error downloading file:', error);
			// Fallback to direct download if fetch fails
			const link = document?.createElement('a');
			link.href = fileURL;
			link.download = name || 'download';
			link.target = '_blank';
			document?.body?.appendChild(link);
			link.click();
			document?.body?.removeChild(link);
		}
	};

	const isImage = type?.startsWith('image/') || type === 'image';

	return (
		<Modal
			open={isModalVisible}
			onCancel={handleClose}
			footer={null}
			width={800}
			className="form-preview-modal"
			closeIcon={<CloseIcon />}
			centered
			title={<CustomHeader name={name} handleDownload={handleDownload} />}
		>
			<div className="preview-container">
				{isImage ? (
					<img src={fileURL} alt={name} className="preview-image" />
				) : (
					<div className="preview-document">
						<iframe src={fileURL} title={name} className="preview-iframe" />
					</div>
				)}
			</div>
		</Modal>
	);
};

const CustomHeader = ({ name, handleDownload }) => (
	<div className="modal-actions">
		<h3 className="file-name">{name}</h3>
		<div className="download-button" onClick={handleDownload}>
			<DownloadIcon />
			<span>Download</span>
		</div>
	</div>
);

export default memo(FormPreview);

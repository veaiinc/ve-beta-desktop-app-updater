import { memo, useEffect, useState } from 'react';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import { ReactComponent as LinkPurple } from '../../../../../assets/svg/Settings/link-purple-color.svg';
import { ReactComponent as LinkGrey } from '../../../../../assets/svg/Settings/link-grey-color.svg';
import { ReactComponent as FileGrey } from '../../../../../assets/svg/Settings/file-grey.svg';
import { ReactComponent as FilePurple } from '../../../../../assets/svg/Settings/file-purple.svg';
import { ReactComponent as CustomTextGrey } from '../../../../../assets/svg/Settings/custom-text-grey.svg';
import { ReactComponent as CustomTextPurple } from '../../../../../assets/svg/Settings/custom-text-purple.svg';
import { ReactComponent as UploadIcon } from '../../../../../assets/svg/Settings/CloudUpload.svg';

import Modal from '../../';

const knowledgeFileTypes = [
	{
		name: 'URL',
		defaultIcon: <LinkGrey />,
		activeIcon: <LinkPurple />,
	},
	{
		name: 'PDF',
		defaultIcon: <FileGrey />,
		activeIcon: <FilePurple />,
	},
	{
		name: 'Custom Text',
		defaultIcon: <CustomTextGrey />,
		activeIcon: <CustomTextPurple />,
	},
];

const AddKnowledgeModal = memo(({ isOpen, toggleModal }) => {
	const [info, setInfo] = useState({
		activeFileType: knowledgeFileTypes[0].name,
		inputURL: '',
		urlsInfo: [],
		pdfFilesInfo: [],
		customTextInfo: [],
	});

	const handleSetAllUploadedPDFFiles = (e) => {
		setInfo((prev) => ({ ...prev, pdfFilesInfo: e.target.files }));
	};

	const handleAddURL = () => {
		setInfo((prev) => ({
			...prev,
			urlsInfo: [
				...prev.urlsInfo,
				{
					url: info?.inputURL,
				},
			],
		}));
	};

	const handleSetInputURL = (e) => {
		setInfo((prev) => ({ ...prev, inputURL: e.target.value }));
	};

	const handleRemoveURL = (index) => {
		console.log('index', index);
		setInfo((prev) => ({
			...prev,
			urlsInfo: prev.urlsInfo.filter((_, i) => i !== index),
		}));
	};

	useEffect(() => {
		console.log(info.pdfFilesInfo);
	}, [info.pdfFilesInfo]);

	useEffect(() => {
		console.log(info.urlsInfo);
	}, [info.urlsInfo]);

	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="addKnowledgeModalContainer">
				<div className="titleAndDescriptionContainer">
					<h1 className="title">
						Add Knowledge <CrossGrey className="closeBtn" onClick={toggleModal} />
					</h1>
					<h2>
						Your AI Assistant is configured with your standard sales workflows. Enhance
						it with knowledge-based resources to obtain more crucial information.
					</h2>
				</div>
				<div className="knowledgeFileTypesContainer">
					{knowledgeFileTypes.map((knowledgeFileType, index) => (
						<div
							className={`knowledgeFileType ${
								info?.activeFileType === knowledgeFileType.name ? 'active' : ''
							}`}
							key={index}
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									activeFileType: knowledgeFileType.name,
								}))
							}
						>
							{info?.activeFileType === knowledgeFileType?.name
								? knowledgeFileType.activeIcon
								: knowledgeFileType.defaultIcon}
							<span>{knowledgeFileType.name}</span>
						</div>
					))}
				</div>
				<div className="knowledgeFileListContainer">
					{info?.activeFileType === 'URL' && (
						<div className="urlListContainer">
							{info?.urlsInfo.map((url, index) => (
								<div className="urlItem" key={index}>
									<div className="linkIconContainer">
										<LinkGrey />
									</div>
									<span className="url">{url.url}</span>
									<div
										className="removeIconContainer"
										onClick={() => handleRemoveURL(index)}
									>
										<CrossGrey />
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="knowledgeFileInputContainer">
					{info?.activeFileType === 'URL' && (
						<div className="URLInputContainer">
							<input
								value={info?.inputURL}
								onChange={handleSetInputURL}
								type="text"
								placeholder="Enter URL"
							/>
							<button onClick={handleAddURL}>Add</button>
						</div>
					)}
					{info?.activeFileType === 'PDF' && (
						<div className="PDFInputContainer">
							<label htmlFor="pdfInput">
								<input
									onChange={handleSetAllUploadedPDFFiles}
									type="file"
									id="pdfInput"
									accept=".pdf"
									multiple
								/>
								<UploadIcon />
								Click to upload .pdf files only <br />
								Files must be less than or equal to 10 MB
							</label>
						</div>
					)}
					{info?.activeFileType === 'Custom Text' && (
						<div className="customTextInputContainer">
							<div className="line"></div>
							<input type="text" placeholder="File Name" />
							<textarea placeholder="Type here..." />
						</div>
					)}
				</div>
				<button className="updateBtn">Update</button>
			</div>
		</Modal>
	);
});

export default memo(AddKnowledgeModal);

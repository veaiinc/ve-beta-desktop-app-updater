import { memo, useState, useContext, useEffect } from 'react';
import { ReactComponent as CrossGrey } from '../../../../../assets/svg/Settings/cross-grey.svg';
import { ReactComponent as LinkGrey } from '../../../../../assets/svg/Settings/link-grey-color.svg';
import { ReactComponent as UploadIcon } from '../../../../../assets/svg/Settings/CloudUpload.svg';
import { ReactComponent as TIcon } from '../../../../../assets/svg/ai_assistant/tIcon.svg';
import { ReactComponent as URLIcon } from '../../../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as FolderIcon } from '../../../../../assets/svg/ai_assistant/folder.svg';
import '../../../../../assets/scss/settings/aiSetup.scss';
import Modal from '../../';
import { message } from 'antd';
import Context from '../../../../../context/context';
import { useParams } from 'react-router-dom';
import { isURL } from '../../../../../helpers';
import Spinner from '../../../loaders/Spinner';

const knowledgeFileTypes = [
	{
		name: 'URL',
		value: 'url',
		icon: <URLIcon />,
	},
	{
		name: 'PDF',
		value: 'pdf',
		icon: <FolderIcon />,
	},
	{
		name: 'Custom Text',
		value: 'customText',
		icon: <TIcon />,
	},
];

const initialState = {
	activeFileType: knowledgeFileTypes?.[0]?.value,
	inputURL: '',
	urlsInfo: [],
	pdfFilesInfo: [],
	customTextInfo: {
		filename: '',
		fileContent: '',
	},
	isUploading: false,
	currentPage: 1,
};

const AddKnowledgeModal = ({ isOpen, toggleModal }) => {
	let {
		aiSetup: {
			activeAiAssistantDetails,
			knowledgeBaseFiles,
			getKnowledgeBaseFiles,
			uploadURLsToKnowledgeBase,
			uploadPDFsToKnowledgeBase,
		},
	} = useContext(Context);
	const { aiAssistantId } = useParams();
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			currentPage: knowledgeBaseFiles?.currentPage,
		}));
	}, [knowledgeBaseFiles]);

	const handleSetAllUploadedPDFFiles = (e) => {
		const files = Array.from(e?.target?.files);
		if (files?.length > 10) {
			message.error('Warning: You can upload only 10 files at a time', 2);
			return;
		}
		files?.forEach((file, i) => {
			if (file?.size > 10 * 1024 * 1024) {
				message.error('Warning: File size must be less than or equal to 10 MB', 1);
				return;
			}
			const fileAlreadyUploaded = info?.pdfFilesInfo?.some((pdf) => {
				return pdf?.name === file?.name;
			});
			if (fileAlreadyUploaded) {
				message.error(
					'Warning: The selected file(s) was(were) previously uploaded already!',
					1.7,
				);
				return;
			}
		});

		setInfo((prev) => ({
			...prev,
			pdfFilesInfo: [...prev?.pdfFilesInfo, ...files],
		}));
	};

	const handleFileUpload = async () => {
		if (info?.activeFileType === 'url') {
			if (info?.urlsInfo?.length === 0) {
				message.error('Warning: Please enter atleast one URL to upload!', 1.7);
				return;
			}
			setInfo((prev) => ({ ...prev, isUploading: true }));
			const statusSummary = await uploadURLsToKnowledgeBase(aiAssistantId, info?.urlsInfo);
			setInfo((prev) => ({
				...prev,
				urlsInfo: [],
			}));
			if (statusSummary?.[0]) {
				message.success('URLs uploaded successfully!', 1);
				toggleModal();
				getKnowledgeBaseFiles(activeAiAssistantDetails?._id, 1, 10, true);
			}
		} else if (info?.activeFileType === 'pdf') {
			if (info?.pdfFilesInfo?.length === 0) {
				message.error('Warning: Please add atleast one PDF file to upload!', 1.7);
				return;
			}
			setInfo((prev) => ({ ...prev, isUploading: true }));
			const files = info?.pdfFilesInfo;
			const statusSummary = await uploadPDFsToKnowledgeBase(aiAssistantId, files);
			setInfo((prev) => ({
				...prev,
				pdfFilesInfo: [],
			}));
			if (statusSummary?.[0]) {
				message.success('PDF Files uploaded successfully!', 1);
				toggleModal();
				getKnowledgeBaseFiles(activeAiAssistantDetails?._id, 1, 10, true);
			}
		} else if (info?.activeFileType === 'customText') {
			if (info?.customTextInfo?.filename === '') {
				message.error('Warning: Please add filename to upload!', 1.7);
				return;
			} else if (info?.customTextInfo?.fileContent.trim() === '') {
				message.error('Warning: Please add file content to upload!', 1.7);
				return;
			}
			setInfo((prev) => ({ ...prev, isUploading: true }));
			const textBlob = new Blob([info?.customTextInfo?.fileContent], { type: 'text/plain' });
			const file = new File([textBlob], info?.customTextInfo?.filename, {
				type: 'text/plain',
			});
			const statusSummary = await uploadPDFsToKnowledgeBase(aiAssistantId, [file]);
			setInfo((prev) => ({
				...prev,
				customTextInfo: {
					filename: '',
					fileContent: '',
				},
			}));
			if (statusSummary?.[0]) {
				message.success('Text File uploaded successfully!', 1);
				toggleModal();
				getKnowledgeBaseFiles(activeAiAssistantDetails?._id, 1, 10, true);
			}
		}
		setInfo((prev) => ({ ...prev, isUploading: false }));
	};

	const handleAddURL = () => {
		if (!info?.isUrlValid) {
			message.error('Warning: Please enter a valid URL', 1);
			return;
		}
		setInfo((prev) => ({
			...prev,
			inputURL: '',
			isUrlValid: false,
			urlsInfo: [
				...prev?.urlsInfo,
				{
					url: info?.inputURL,
				},
			],
		}));
	};

	const handleSetInputURL = (e) => {
		setInfo((prev) => ({
			...prev,
			isUrlValid: isURL(e?.target?.value),
			inputURL: e?.target?.value,
		}));
	};

	const handleRemoveURL = (index) => {
		setInfo((prev) => ({
			...prev,
			urlsInfo: prev?.urlsInfo?.filter((url, i) => i !== index),
		}));
	};

	const handleRemovePDF = (index) => {
		setInfo((prev) => ({
			...prev,
			pdfFilesInfo: prev?.pdfFilesInfo?.filter((pdf, i) => i !== index),
		}));
	};

	const handleSetTxtFilename = (e) => {
		const filename = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			customTextInfo: {
				...prev?.customTextInfo,
				filename: `${filename}.txt`,
			},
		}));
	};

	const handleSetTxtFileContent = (e) => {
		const fileContent = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			customTextInfo: {
				...prev?.customTextInfo,
				fileContent,
			},
		}));
	};

	return (
		<Modal isOpen={isOpen} closeModal={toggleModal}>
			<div className="addKnowledgeModalContainer">
				<div className="titleAndDescriptionContainer">
					<h1 className="title">
						Add Knowledge <CrossGrey className="closeBtn" onClick={toggleModal} />
					</h1>
					<h2>Choose one of the following:</h2>
				</div>
				<div className="knowledgeFileTypesContainer">
					{knowledgeFileTypes.map((knowledgeFileType, index) => (
						<div
							className={`knowledgeFileType ${
								info?.activeFileType === knowledgeFileType?.value ? 'active' : ''
							}`}
							key={index}
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									activeFileType: knowledgeFileType?.value,
								}))
							}
						>
							{knowledgeFileType?.icon}
							<span>{knowledgeFileType?.name}</span>
						</div>
					))}
				</div>
				<div className="contentWrapper">
					<div className="knowledgeFileInputContainer">
						{info?.activeFileType === 'url' && (
							<div className="knowledgeFileInputContainer">
								<div className="URLInputContainer">
									<input
										value={info?.inputURL}
										onChange={handleSetInputURL}
										type="text"
										placeholder="Enter URL"
										autoFocus={true}
									/>
									<button onClick={handleAddURL}>Add</button>
								</div>
							</div>
						)}
						{info?.activeFileType === 'pdf' && (
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
						{info?.activeFileType === 'customText' && (
							<div className="customTextInputContainer">
								<div className="line"></div>
								<input
									onInput={handleSetTxtFilename}
									type="text"
									placeholder="File Name"
								/>
								<textarea
									onInput={handleSetTxtFileContent}
									placeholder="Type here..."
								/>
							</div>
						)}
					</div>
					<div className="knowledgeFileListContainer">
						{info?.activeFileType === 'url' ? (
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
						) : info?.activeFileType === 'pdf' ? (
							<div className="pdfListContainer">
								{info?.pdfFilesInfo?.map((pdf, index) => (
									<div className="urlItem" key={index}>
										<div className="linkIconContainer">
											<LinkGrey />
										</div>
										<span className="url">{pdf?.name}</span>
										<div
											className="removeIconContainer"
											onClick={() => handleRemovePDF(index)}
										>
											<CrossGrey />
										</div>
									</div>
								))}
							</div>
						) : null}
					</div>
					<div className="updateBtnContainer">
						<button className="cancelBtn">Cancel</button>
						<button
							disabled={info?.isUploading}
							style={{ cursor: info?.isUploading ? 'not-allowed' : 'pointer' }}
							onClick={handleFileUpload}
							className="updateBtn"
						>
							{info?.isUploading ? (
								<p className="loader">
									Uploading Knowledge Files...
									<Spinner width={'14px'} height={'14px'} />
								</p>
							) : (
								<p>
									Upload{' '}
									{knowledgeFileTypes
										?.filter(
											(knowledge) =>
												knowledge?.value === info?.activeFileType,
										)
										.map((knowledge) => knowledge?.name)}
								</p>
							)}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default memo(AddKnowledgeModal);

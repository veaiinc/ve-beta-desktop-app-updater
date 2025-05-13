import { memo, useState } from 'react';
import '../../../assets/scss/notes/uploadPopup.scss';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ReactComponent as UploadIcon } from '../../../assets/svg/notes/upload.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/notes/link.svg';
import { message } from '../globalComponents/CustomToast';
import { isURL } from '../../../helpers';

const initialState = {
	selectedUploadCategory: 'images',
	link: '',
	isLinkValid: false,
};

const uploadCategoryOptions = [
	{
		id: 1,
		label: 'Images',
		value: 'images',
	},
	{
		id: 2,
		label: 'Upload',
		value: 'upload',
	},
	{
		id: 3,
		label: 'Link',
		value: 'link',
	},
	{
		id: 4,
		label: 'Unsplash',
		value: 'unsplash',
	},
];

const UploadPopup = ({ closePopup, setLinkUploadedInfo }) => {
	const { noteId } = useParams();
	const {
		notes: { notesCoverImageLinkUpload, notesCoverImageFileUpload },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	const handleLinkSubmit = async () => {
		const payload = {
			link: info.link,
			pageId: noteId,
		};
		const response = await notesCoverImageLinkUpload(payload);
		const success = response[1];
		if (success) {
			message.success('Link uploaded successfully');
			setInfo(initialState);
			setLinkUploadedInfo(info.link);
			closePopup();
		} else {
			message.error('Failed to upload link');
		}
	};

	const handleLinkChange = (e) => {
		const link = e.target.value;
		setInfo((prev) => ({ ...prev, link, isLinkValid: isURL(link) }));
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
	};

	const uploadCategoryOptionsUI = {
		images: <div>Images</div>,
		upload: (
			<div className="upload">
				<input
					type="file"
					className="uploadInput"
					accept="image/*"
					onChange={handleImageUpload}
				/>
				<UploadIcon />
				<div className="uploadContent">
					<div className="uploadTitle">Click to upload</div>
					<div className="uploadSubtitle"> supported formats .jpg, .jpeg, .png</div>
				</div>
			</div>
		),
		link: (
			<div className="link">
				<div className="linkInputContainer">
					<LinkIcon />
					<input
						autoFocus
						type="text"
						className="linkInput"
						placeholder="Paste your link here"
						value={info.link}
						onChange={handleLinkChange}
					/>
				</div>
				<div className="linkSubmitButtonContainer">
					<button
						disabled={!info.isLinkValid}
						onClick={handleLinkSubmit}
						className={`linkSubmitButton ${!info.isLinkValid ? 'disabled' : ''}`}
					>
						Submit
					</button>
				</div>
			</div>
		),
		unsplash: <div>Unsplash</div>,
	};

	return (
		<div className="uploadPopupContainer">
			<header className="uploadPopupHeader">
				{uploadCategoryOptions.map((uploadCategory) => (
					<div
						key={uploadCategory.id}
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								selectedUploadCategory: uploadCategory.value,
							}))
						}
						className={`uploadCategoryLabel ${
							info.selectedUploadCategory === uploadCategory.value ? 'active' : ''
						}`}
					>
						{uploadCategory.label}
					</div>
				))}
			</header>
			<div className="uploadPopupBody">
				{uploadCategoryOptionsUI[info.selectedUploadCategory]}
			</div>
		</div>
	);
};

export default memo(UploadPopup);

import { memo, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../../assets/scss/notes/uploadPopup.scss';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import { isURL } from '../../../helpers';
import { ReactComponent as UploadIcon } from '../../../assets/svg/notes/upload.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/notes/link.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/notes/search.svg';
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

const UploadPopup = ({ closePopup, setLocalCoverImage }) => {
	const { noteId } = useParams();
	const {
		notes: { notesCoverImageLinkUpload, notesCoverImageFileUpload },
		workspaceAssets: { workspaceImages, getWorkspaceImages },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		if (workspaceImages.length === 0) {
			getWorkspaceImages({ page: 1, limit: 10 });
		}
	}, [workspaceImages]);

	console.log(workspaceImages);

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
			setLocalCoverImage(info.link);
			closePopup();
		} else {
			message.error('Failed to upload link');
		}
	};

	const handleLinkChange = (e) => {
		const link = e.target.value;
		setInfo((prev) => ({ ...prev, link, isLinkValid: isURL(link) }));
	};

	const handleImageUpload = async (e) => {
		const imageFile = e.target.files[0];
		const payload = {
			imageFile,
			pageId: noteId,
		};
		const response = await notesCoverImageFileUpload(payload);
		if (response[0]) {
			message.success('Cover image updated successfully');
			setInfo(initialState);
			setLocalCoverImage(URL.createObjectURL(imageFile));
			closePopup();
		} else {
			message.error('Failed to update cover image');
		}
	};

	const handleImageSearch = (e) => {
		const search = e.target.value;
		console.log(search);
	};

	const uploadCategoryOptionsUI = {
		images: (
			<div className="images">
				<div className="imagesSearchContainer">
					<SearchIcon />
					<input
						className="imagesSearchInput"
						autoFocus
						type="text"
						onChange={handleImageSearch}
						placeholder="Search workspace images"
					/>
				</div>
				<div className="imagesListContainer"></div>
			</div>
		),
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

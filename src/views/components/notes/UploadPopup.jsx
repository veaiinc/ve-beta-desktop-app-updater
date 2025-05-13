import { memo } from 'react';
import '../../../assets/scss/notes/uploadPopup.scss';

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

const UploadPopup = () => {
	return (
		<div className="uploadPopupContainer">
			<header className="header">
				{uploadCategoryOptions.map((uploadCategory) => (
					<div key={uploadCategory.id}>{uploadCategory.label}</div>
				))}
			</header>
		</div>
	);
};

export default memo(UploadPopup);

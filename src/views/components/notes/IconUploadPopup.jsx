import { memo, useContext, useState } from 'react';
import '../../../assets/scss/notes/iconUploadPopup.scss';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';

// const iconTypeOptions = [
// 	{
// 		id: 1,
// 		label: 'Emoji',
// 		value: 'emoji',
// 	},
// 	{
// 		id: 2,
// 		label: 'Icons',
// 		value: 'icons',
// 	},
// 	{
// 		id: 3,
// 		label: 'Upload',
// 		value: 'upload',
// 	},
// ];

const IconUploadPopup = ({ setSelectedEmoji, closePopup }) => {
	const { noteId } = useParams();
	const {
		notes: { notesIconUpload },
		themeInfo: { theme },
	} = useContext(Context);

	// const [info, setInfo] = useState({
	// 	activeIconType: 'emoji',
	// });

	return (
		// <div className="iconUploadPopupContainer">
		// 	<header className="iconUploadPopupHeader">
		// 		{iconTypeOptions.map((option) => (
		// 			<span
		// 				className={`iconTypeOption ${
		// 					info?.activeIconType === option.value ? 'active' : ''
		// 				}`}
		// 				key={option.id}
		// 				onClick={() =>
		// 					setInfo((prev) => ({
		// 						...prev,
		// 						activeIconType: option.value,
		// 					}))
		// 				}
		// 			>
		// 				{option.label}
		// 			</span>
		// 		))}
		// 	</header>
		// 	<div className="iconUploadPopupBody">
		<Picker
			theme={theme}
			data={data}
			onEmojiSelect={(emoji) => {
				setSelectedEmoji(emoji);
				notesIconUpload({ icon: emoji, pageId: noteId });
				closePopup();
			}}
		/>
		// 	</div>
		// </div>
	);
};

export default memo(IconUploadPopup);

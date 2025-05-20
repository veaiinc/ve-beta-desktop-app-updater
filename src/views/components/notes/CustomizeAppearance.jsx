import { memo } from 'react';
import '../../../assets/scss/notes/customizeAppearance.scss';
import ImageIcon from '../../../assets/svg/notes/image.svg?react';
import EmojiIcon from '../../../assets/svg/notes/emoji.svg?react';

const customizeAppearanceOptions = [
	{
		id: 1,
		label: 'Add icon',
		value: 'icon',
		icon: <EmojiIcon />,
	},
	{
		id: 2,
		label: 'Add cover',
		value: 'cover',
		icon: <ImageIcon />,
	},
];

const CustomizeAppearance = ({ showUploadPopup }) => {
	return (
		<div className="customizeAppearanceContainer">
			{customizeAppearanceOptions.map((option) => (
				<div
					key={option.id}
					className="customizeAppearanceOption"
					onClick={() => showUploadPopup(option.value)}
				>
					{option.icon}
					<div className="customizeAppearanceOptionLabel">{option.label}</div>
				</div>
			))}
		</div>
	);
};

export default memo(CustomizeAppearance);

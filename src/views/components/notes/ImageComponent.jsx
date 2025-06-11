import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import moment from 'moment';
import { memo, useContext } from 'react';
// import s from '../../../assets/scss/notes/database.module.scss';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import Context from '../../../context/context';

const ImageComponent = memo(({ block, editor }) => {
	// const {
	// 	notes: {},
	// } = useContext(Context);
	console.log('block', block.props);

	return (
		<div className="custom-image-block">
			<img src={block.props.url} alt={block.props.caption} />
		</div>
	);
});

export default ImageComponent;

export const ImageBlock = createReactBlockSpec(
	{
		type: 'image',
		propSchema: {
			// Default BlockNote props (inherited from all blocks)
			textAlignment: defaultProps.textAlignment,
			textColor: defaultProps.textColor,
			backgroundColor: defaultProps.backgroundColor,

			// Standard BlockNote image props
			url: {
				default: '',
			},
			caption: {
				default: '',
			},
			width: {
				default: null, // Default width in pixels
			},

			// Your custom props
			name: {
				default: '',
			},
			showPreview: {
				default: true,
			},

			// Additional props for enhanced functionality
			alt: {
				default: '',
			},
			alignment: {
				default: 'center',
				values: ['left', 'center', 'right'],
			},
			previewWidth: {
				default: 100, // Percentage
			},
			source: {
				default: 'upload', // "upload", "unsplash", "embed", etc.
			},
			originalSize: {
				default: null, // Store original dimensions
			},
			compressed: {
				default: false,
			},
		},
		content: 'none',
		isSelectable: true, // Changed to true for better UX
	},
	{
		render: ImageComponent,
	},
);

export const insertImage = (editor, pageId) => ({
	title: 'Image',
	subtext: 'Image with caption',
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: 'image',
		});
	},
	aliases: ['image', 'picture', 'photo'],
	group: 'Media',
	icon: <div>Image</div>,
});

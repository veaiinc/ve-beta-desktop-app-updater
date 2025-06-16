import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import moment from 'moment';
import { memo, useContext, useState, useCallback, useEffect } from 'react';
// import s from '../../../assets/scss/notes/database.module.scss';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import Context from '../../../context/context';
import { Tooltip } from 'antd';
import ImageUploadPopup from './ImageUploadPopup';
import '../../../assets/scss/notes/imageComponent.scss';
import ReactModal from '../modalsV2';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { ReactComponent as ImageIcon } from '../../../assets/svg/notes/image.svg';

const ImageComponent = memo(({ block, editor }) => {
	const [showUploadPopup, setShowUploadPopup] = useState(!block.props.url);
	const [isSelected, setIsSelected] = useState(false);
	const [showReplace, setShowReplace] = useState(false);
	const [size, setSize] = useState({
		width: block.props.width || 500,
		height: block.props.height || 300,
	});
	const {
		notes: { uploadNotesImageBlock },
	} = useContext(Context);

	const onResize = useCallback((event, { size: newSize }) => {
		setSize(newSize);
	}, []);

	const onResizeStop = useCallback(
		(event, { size: newSize }) => {
			editor.updateBlock(block, {
				type: 'image',
				props: {
					...block.props,
					width: newSize.width,
					height: newSize.height,
				},
			});
		},
		[block, editor],
	);

	const toggleFitMode = useCallback(() => {
		const modes = ['contain', 'cover', 'fit'];
		const currentIndex = modes.indexOf(block.props.fitMode || 'contain');
		const nextIndex = (currentIndex + 1) % modes.length;
		const newFitMode = modes[nextIndex];

		editor.updateBlock(block, {
			type: 'image',
			props: {
				...block.props,
				fitMode: newFitMode,
			},
		});
	}, [block, editor]);

	const handleImageSelect = async (imageUrl) => {
		if (imageUrl) {
			// If it's a File object (from upload)
			if (imageUrl instanceof File) {
				const response = await uploadNotesImageBlock(
					{
						pageId: block.props.pageId,
						uploadPageBlockImageInput: {
							imageName: imageUrl.name,
							imageSize: imageUrl.size,
						},
					},
					imageUrl,
				);

				if (response?.[0]) {
					imageUrl = response[1];
				}
			}

			// Update the block with the new image URL
			editor.updateBlock(block, {
				type: 'image',
				props: {
					...block.props,
					url: imageUrl,
				},
			});
		}
	};

	const handleClickOutside = useCallback(
		(event) => {
			if (isSelected) {
				setIsSelected(false);
			}
		},
		[isSelected],
	);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<div className="custom-image-block">
			{block.props.url ? (
				<div
					style={{
						position: 'relative',
						display: 'inline-block',
					}}
					onMouseEnter={() => setShowReplace(true)}
					onMouseLeave={() => setShowReplace(false)}
				>
					<ResizableBox
						width={size.width}
						height={size.height}
						onResize={onResize}
						onResizeStop={onResizeStop}
						minConstraints={[100, 100]}
						maxConstraints={[800, 800]}
						resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
						className={`resizable-box ${isSelected ? 'selected' : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							setIsSelected(true);
						}}
						style={{
							border: isSelected ? '2px solid var(--info)' : 'none',
						}}
					>
						<div className="image-container">
							<img
								src={block.props.url}
								alt={block.props.caption}
								data-fit={block.props.fitMode || 'fit'}
							/>
						</div>
					</ResizableBox>
					{showReplace && (
						<div className="image-controls">
							<button
								onClick={(e) => {
									e.stopPropagation();
									toggleFitMode();
								}}
							>
								{block.props.fitMode === 'cover'
									? 'Contain'
									: block.props.fitMode === 'fit'
									? 'Cover'
									: 'Fit'}
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setShowUploadPopup(true);
								}}
							>
								Replace
							</button>
						</div>
					)}
				</div>
			) : (
				<div
					className="custom-image-block-placeholder"
					onClick={() => setShowUploadPopup(true)}
				>
					<div className="custom-image-block-placeholder-icon">
						<ImageIcon />
					</div>
					<p className="custom-image-block-placeholder-text">Add image</p>
				</div>
			)}

			<Tooltip
				open={showUploadPopup}
				onOpenChange={(visible) => setShowUploadPopup(visible)}
				placement="bottomRight"
				title={
					<ImageUploadPopup
						closePopup={() => setShowUploadPopup(false)}
						onImageSelect={handleImageSelect}
						noteId={block.props.pageId}
					/>
				}
				overlayInnerStyle={{
					backgroundColor: 'inherit',
					padding: 0,
				}}
				arrow={false}
				trigger="click"
				destroyTooltipOnHide={false}
				align={{
					points: ['tr', 'br'],
					offset: [0, 0],
				}}
			/>
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
				default: 500, // Default width in pixels
			},
			height: {
				default: 300, // Default height in pixels
			},
			fitMode: {
				default: 'contain',
				values: ['contain', 'cover'],
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
			pageId: {
				default: '',
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
			props: {
				pageId,
				fitMode: 'contain',
			},
		});
	},
	aliases: ['image', 'picture', 'photo'],
	group: 'Media',
	icon: <ImageIcon />,
});

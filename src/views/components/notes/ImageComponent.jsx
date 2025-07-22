import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
// import moment from 'moment';
import { memo, useContext, useState, useCallback, useEffect } from 'react';
// import s from '../../../assets/scss/notes/database.module.scss';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import Context from '../../../context/context';
import { Tooltip } from 'antd';
import ImageUploadPopup from './ImageUploadPopup';
import '../../../assets/scss/notes/imageComponent.scss';
// import ReactModal from '../modalsV2';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { ReactComponent as ImageIcon } from '../../../assets/svg/notes/image.svg';
import Spinner from '../loaders/Spinner';
import { EditorContext } from './Editor';

const ImageComponent = ({ block, editor }) => {
	const { previousBlocksRef, pageId } = useContext(EditorContext);
	const {
		notes: { uploadNotesImageBlock },
	} = useContext(Context);

	const [info, setInfo] = useState({
		showUploadPopup: !block.props.url,
		isSelected: false,
		showReplace: false,
		isLoading: false,
		size: {
			width: block.props.width || 500,
			height: block.props.height || 300,
		},
	});

	// Remove individual state variables since they're now in the info state

	const sourceBlockId = previousBlocksRef?.current?.get(block?.id)?._id;

	const handleInfoChange = useCallback((newInfo) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...newInfo }));
	}, []);

	const onResize = useCallback(
		(event, { size: newSize }) => {
			handleInfoChange({ size: newSize });
		},
		[handleInfoChange],
	);

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

	const handleImageSelect = async (imageUrl, imageFile = null) => {
		handleInfoChange({ isLoading: true });

		try {
			if (imageFile) {
				const response = await uploadNotesImageBlock(
					{
						pageId: pageId,
						blockId: sourceBlockId,
						uploadPageBlockImageInput: {
							imageName: imageFile.name,
							imageSize: imageFile.size,
						},
					},
					imageFile,
					true,
				);
				if (response?.[0]) {
					imageUrl = response[1];
				}
			}

			// Use native image loading to check availability
			const waitForImageLoad = (url, maxAttempts = 10, interval = 2000) =>
				new Promise((resolve) => {
					let attempts = 0;

					const tryLoad = () => {
						const img = new Image();
						img.onload = () => resolve(true);
						img.onerror = () => {
							if (++attempts >= maxAttempts) return resolve(false);
							setTimeout(tryLoad, interval);
						};
						img.src = url + `?cacheBust=${Date.now()}`; // avoid caching issues
					};

					tryLoad();
				});

			const available = await waitForImageLoad(imageUrl);
			if (available) {
				editor.updateBlock(block, {
					type: 'image',
					props: {
						...block.props,
						source: imageFile ? 'upload' : 'link',
						url: imageUrl,
					},
				});
			} else {
				console.warn('Image not available after polling.');
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		} finally {
			handleInfoChange({ isLoading: false });
		}
	};

	const handleClickOutside = useCallback(
		(event) => {
			if (info.isSelected) {
				handleInfoChange({ isSelected: false });
			}
		},
		[info.isSelected, handleInfoChange],
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
					onMouseEnter={() => handleInfoChange({ showReplace: true })}
					onMouseLeave={() => handleInfoChange({ showReplace: false })}
				>
					<ResizableBox
						width={info.size.width}
						height={info.size.height}
						onResize={onResize}
						onResizeStop={onResizeStop}
						minConstraints={[100, 100]}
						maxConstraints={[800, 800]}
						resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
						className={`resizable-box ${info.isSelected ? 'selected' : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							handleInfoChange({ isSelected: true });
						}}
						style={{
							border: info.isSelected ? '2px solid var(--info)' : 'none',
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
					{info.showReplace && (
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
									handleInfoChange({ showUploadPopup: true });
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
					onClick={() => !info.isLoading && handleInfoChange({ showUploadPopup: true })}
				>
					{info.isLoading ? (
						<>
							<div className="custom-image-block-placeholder-loading">
								<Spinner width="24px" height="24px" />
							</div>
							<p className="custom-image-block-placeholder-text">
								Uploading image...
							</p>
						</>
					) : (
						<>
							<div className="custom-image-block-placeholder-icon">
								<ImageIcon />
							</div>
							<p className="custom-image-block-placeholder-text">Add image</p>
						</>
					)}
				</div>
			)}

			<Tooltip
				open={info.showUploadPopup}
				onOpenChange={(visible) => handleInfoChange({ showUploadPopup: visible })}
				placement="bottomRight"
				title={
					<ImageUploadPopup
						closePopup={() => handleInfoChange({ showUploadPopup: false })}
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
};

export default memo(ImageComponent);

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
	key: 'image',
	onItemClick: () => {
		insertOrUpdateBlock(editor, {
			type: 'image',
			props: {
				fitMode: 'contain',
			},
		});
	},
	aliases: ['image', 'picture', 'photo'],
	group: 'Media',
	icon: <ImageIcon />,
});

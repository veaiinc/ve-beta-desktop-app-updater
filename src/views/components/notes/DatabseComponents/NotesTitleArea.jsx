import { Tooltip } from 'antd';
import { memo, useState } from 'react';
import UploadPopup from '../UploadPopup';
import IconUploadPopup from '../IconUploadPopup';
import CustomizeAppearance from '../CustomizeAppearance';
import CustomTextArea from '../../globalComponents/CustomTextArea';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/notes/cross.svg';
import s from '../../../../assets/scss/notes/notesTitleArea.module.scss';

const tooltipStyles = {
	body: {
		backgroundColor: 'inherit',
	},
};

const NotesTitleArea = ({
	iconImage,
	coverImage,
	updateParentState,
	handleRemoveIcon,
	handleTitleChange,
	title,
	showRemoveIconBtn,
}) => {
	const [info, setInfo] = useState({
		showCustomizeAppearance: false,
		showUploadPopup: false,
		uploadType: '',
	});

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // optional: stops newline if it's a textarea
		}
	};

	return (
		<Tooltip
			// open={info?.showCustomizeAppearance}
			open={false}
			onOpenChange={() => {
				if (info?.showUploadPopup) {
					updateParentState({ showUploadPopup: false });
					handleInfoChange({ showUploadPopup: false });
				}
				handleInfoChange({ showCustomizeAppearance: !info?.showCustomizeAppearance });
			}}
			placement="bottomLeft"
			title={
				info?.showUploadPopup && info?.uploadType === 'cover' ? (
					<UploadPopup
						closePopup={() =>
							handleInfoChange({
								showUploadPopup: false,
								showCustomizeAppearance: false,
							})
						}
						setLocalCoverImage={(coverImage) =>
							updateParentState({
								localCoverImage: coverImage,
								coverImageRemoved: false,
							})
						}
						uploadType={info?.uploadType}
					/>
				) : info?.showUploadPopup && info?.uploadType === 'icon' ? (
					<IconUploadPopup
						setSelectedEmoji={(emoji) => updateParentState({ selectedEmoji: emoji })}
						closePopup={() =>
							updateParentState({
								showUploadPopup: false,
								showCustomizeAppearance: false,
							})
						}
					/>
				) : (
					<CustomizeAppearance
						// uploadType can be 'cover' or 'icon'
						showUploadPopup={(uploadType) =>
							handleInfoChange({ showUploadPopup: true, uploadType })
						}
					/>
				)
			}
			styles={tooltipStyles}
			arrow={false}
		>
			<div
				className={s.notesIconContainer}
				style={{
					paddingTop: coverImage ? '0px' : '48px',
				}}
			>
				{iconImage && (
					<div
						className={s.notesIconWrapper}
						onMouseEnter={() => updateParentState({ showRemoveIconBtn: true })}
						onMouseLeave={() => updateParentState({ showRemoveIconBtn: false })}
					>
						{showRemoveIconBtn && (
							<div className={s.removeIconBtnContainer}>
								<CrossIcon className={s.removeIconBtn} onClick={handleRemoveIcon} />
							</div>
						)}
						{iconImage?.native}
					</div>
				)}
				<CustomTextArea
					className={s.notesTitle}
					value={title}
					onChange={handleTitleChange}
					autoResize={true}
					onKeyDown={handleKeyDown}
					placeholder="New note"
					replacePlaceholder={true}
				/>
			</div>
		</Tooltip>
	);
};

export default memo(NotesTitleArea);

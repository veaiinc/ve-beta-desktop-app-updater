import React, { memo, useCallback, useState } from 'react';
import { ReactComponent as OpenEye } from '../../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';

import s from '../../../../../assets/scss/notes/dropdown/allFields.module.scss';
import AddField from './AddField';

const ADD_NEW_KEY = 'ADD_NEW_KEY';

const AllFields = ({ fields = [], handleClose, handleBack, pageId, databaseId }) => {
	const [info, setInfo] = useState({
		activeEditing: null,
	});

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleBackToAllFields = useCallback(() => {
		handleInfoChange({ activeEditing: null });
	}, []);

	return !info?.activeEditing ? (
		<div className={s.allFields + ' ' + s.optionsDropdownContainer}>
			<div className={s.optionsDropdownHeader}>
				<span className={s.optionsDropdownHeaderTitleWrapper}>
					<ArrowLeftSvg className={s.cursorPointer} onClick={handleBack} />
					<span className={s.optionsDropdownHeaderTitle}>Properties</span>
				</span>
				<CrossSvg className={s.cursorPointer} onClick={handleClose} />
			</div>
			<div className={s.optionsDropdownBody}>
				<input type="text" placeholder="Search for properties" />
				<div className={s.optionsDropdownPropertyContainer}>
					{fields.map((field, idx) => (
						<div className={s.propertyListItem} key={field._id || idx}>
							<div className={s.dragHandleIcon}>
								<SixDotsSvg />
							</div>
							{/* {field.Icon && <field.Icon />} */}
							<span className={s.propertyListItemTitle}>{field.name}</span>

							{field.show ? (
								field.isTitle ? (
									<OpenEye className={s.crossedEyeIcon} />
								) : (
									<OpenEye />
								)
							) : (
								<CrossedOpenEye className={s.crossedEyeIcon} />
							)}

							<ChevronRightThinSvg className={s.arrowIcon} />
						</div>
					))}
				</div>
			</div>
			<div className={`${s.footer} ${s.cursorPointer}`}>
				<div
					className={s.option}
					onClick={() => handleInfoChange({ activeEditing: ADD_NEW_KEY })}
				>
					<PlusIcon className={s.plusIcon} />
					<div className={s.text}>Add new property</div>
					<ChevronRightThinSvg className={s.arrowIcon} />
				</div>
			</div>{' '}
		</div>
	) : info?.activeEditing === ADD_NEW_KEY ? (
		<AddField
			handleBack={handleBackToAllFields}
			handleClose={handleClose}
			pageId={pageId}
			databaseId={databaseId}
		/>
	) : null;
};

export default memo(AllFields);

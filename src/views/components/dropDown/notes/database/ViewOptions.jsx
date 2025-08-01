import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import s from '../../../../../assets/scss/notes/dropdown/viewOptions.module.scss';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ListSvg } from '../../../../../assets/svg/tasks/listDotsAndLines.svg';
import { ReactComponent as FolderSvg } from '../../../../../assets/svg/tasks/folder.svg';
// import { ReactComponent as GridSvg } from '../../../../../assets/svg/tasks/grid.svg';
// import { ReactComponent as DuplicateIcon } from '../../../../../assets/svg/tasks/duplicate.svg';
import { ReactComponent as DeleteIcon } from '../../../../../assets/svg/tasks/dustBin.svg';
import GroupDropDown from '../../tasks/GroupDropDown';
import AllFields from './AllFields';
import Context from '../../../../../context/context';
import ViewLayouts, { layouts } from './ViewLayouts';

const ViewOptions = ({
	children,
	fields,
	view,
	databaseId,
	blockId,
	pageId,
	handleDeleteDatabaseView,
	isLastView,
	databaseName,
}) => {
	const {
		notes: { updateDatabaseView },
	} = useContext(Context);

	const [info, setInfo] = useState({
		openedDropDown: null,
		isOpen: false,
		viewLabel: '',
	});

	useEffect(() => {
		if (view) {
			handleInfoChange({ viewLabel: view?.label || '' });
		}
	}, [view]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const resetGroupInfo = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, openedDropDown: null }));
	}, []);

	// Function to handle closing the dropdown
	const handleClose = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, openedDropDown: null, isOpen: false }));
	}, []);

	// Function to handle opening/closing the main dropdown
	const handleToggle = useCallback((open) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isOpen: open,
			openedDropDown: null, // Reset any opened sub-dropdown
		}));
	}, []);

	// Function to handle opening the group dropdown
	const handleOpenGroup = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, openedDropDown: 'group' }));
	}, []);

	// Get the currently selected group name
	const getSelectedGroupName = useCallback(() => {
		if (!view?.groupBy?.fieldId) return 'None';

		const selectedField = fields?.find((field) => field?._id === view?.groupBy?.fieldId);
		return selectedField?.name || 'Unknown Field';
	}, [view?.groupBy?.fieldId, fields]);

	const handleViewUpdate = useCallback(
		async (data) => {
			if (data?.label !== undefined) {
				if (!data?.label) {
					handleInfoChange({ viewLabel: view?.label });
					return;
				}
				if (data?.label === view?.label) {
					return;
				}
			}

			const payload = {
				pageId,
				updateDatabaseViewId: view?._id,
				input: {
					...data,
				},
			};
			await updateDatabaseView(payload, blockId);
		},
		[view, pageId, blockId],
	);

	return (
		<Tooltip
			title={
				info?.openedDropDown === 'group' ? (
					<GroupDropDown
						handleClose={handleClose}
						handleBack={resetGroupInfo}
						properties={fields}
						group={view?.groupBy}
						updateViewInfo={() => {}}
						viewType={view?.type}
						view={view}
						databaseId={databaseId}
						blockId={blockId}
					/>
				) : info?.openedDropDown === 'allFields' ? (
					<AllFields
						fields={fields}
						handleClose={handleClose}
						handleBack={resetGroupInfo}
						pageId={pageId}
						databaseId={databaseId}
					/>
				) : info?.openedDropDown === 'layouts' ? (
					<ViewLayouts
						handleClose={handleClose}
						handleBack={resetGroupInfo}
						updateView={handleViewUpdate}
						view={view}
					/>
				) : (
					<div className={s.viewOptionDropdown}>
						<div className={s.headerSection}>
							<div className={s.title}>View Options</div>
							<button className={s.closeButton} onClick={handleClose}>
								<CrossSvg />
							</button>
						</div>
						<div className={s.viewSettings}>
							<input
								type="text"
								placeholder="View name"
								value={info?.viewLabel}
								onChange={(e) => handleInfoChange({ viewLabel: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e?.currentTarget?.blur();
									}
								}}
								onBlur={() => handleViewUpdate({ label: info?.viewLabel })}
							/>
							<div className={s.option}>
								<FolderSvg />
								<div className={s.text}>Source</div>
								<div className={s.overflowText}>{databaseName}</div>
							</div>
							<div
								className={s.option}
								onClick={() => handleInfoChange({ openedDropDown: 'layouts' })}
							>
								{layouts?.[view?.type]?.Icon}

								<div className={s.text}>Layout</div>
								<div className={s.subText}>
									{layouts?.[view?.type]?.label} <ChevronRightThinSvg />
								</div>
							</div>
						</div>
						<div className={s.propertySettings}>
							<div
								className={s.option}
								onClick={() => handleInfoChange({ openedDropDown: 'allFields' })}
							>
								<ListSvg className={s.listIcon} />

								<div className={s.text}>Properties</div>
								<div className={s.subText}>
									{fields?.length} Shown <ChevronRightThinSvg />
								</div>
							</div>
							<div
								className={s.option}
								onClick={() => handleInfoChange({ openedDropDown: 'group' })}
							>
								<ListSvg className={s.listIcon} />

								<div className={s.text}>Group</div>
								<div className={s.subText}>
									{getSelectedGroupName()} <ChevronRightThinSvg />
								</div>
							</div>
						</div>
						{!isLastView && (
							<div className={s.footerSection}>
								{/* <div className={s.option}>
								<DuplicateIcon />

								<div className={s.text}>Duplicate view</div>
							</div> */}

								<div
									className={s.option}
									onClick={() => {
										handleInfoChange({ isOpen: false });
										handleDeleteDatabaseView(view?._id);
									}}
								>
									<DeleteIcon />
									<div className={s.text}>Delete view</div>
								</div>
							</div>
						)}
					</div>
				)
			}
			placement="bottomRight"
			classNames={{ root: 'status-dropdown' }}
			color="transparent"
			open={info?.isOpen}
			trigger={['click']}
			destroyOnHide={true}
			onOpenChange={(open) => {
				handleToggle(open);
			}}
		>
			<div>{children}</div>
		</Tooltip>
	);
};

export default memo(ViewOptions);

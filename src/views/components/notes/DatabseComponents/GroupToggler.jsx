import { memo, useContext, useState } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/groupToggler.module.scss';
import { ReactComponent as ChevronSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { colors } from '../../../../helpers/databaseHelpers';
import CheckBox from '../../tasks/listView/CheckBox';
import Context from '../../../../context/context';

const GroupToggler = ({
	children,
	groupData,
	type,
	totalDocs,
	currentPage,
	totalPages,
	hasNextPage,
	viewId,
	blockId,
	databaseId,
	pageId,
}) => {
	const {
		notes: { fetchMoreGroupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isOpen: true,
		dataLoading: false,
	});

	const getGroupHeaderElement = ({ label, type, color }) => {
		if (!label) return <span className={s.groupTogglerContent}>No value</span>;
		if (['text', 'title', 'email', 'url', 'phone', 'number', 'date'].includes(type)) {
			return <span className={s.groupTogglerContent}>{label}</span>;
		}
		if (['status', 'multi_select', 'select'].includes(type)) {
			return (
				<span className={s.groupTogglerTag}>
					<span
						className={s.groupTogglerTagColor}
						style={{ backgroundColor: colors[color]?.color }}
					/>
					<span className={s.groupTogglerTagLabel}>{label}</span>
				</span>
			);
		}
		if (['person', 'last_edited_by', 'created_by'].includes(type)) {
			return (
				<span className={s.groupTogglerPerson}>
					<span className={s.groupTogglerContentAvatar}>{label?.charAt(0)}</span>
					<span className={s.groupTogglerContentLabel}>{label}</span>
				</span>
			);
		}
		if (type === 'checkbox') {
			return (
				<span className={s.groupTogglerContent}>
					<CheckBox value={label === 'checked'} /> {label}
				</span>
			);
		}
	};
	const handleToggle = () => {
		setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));
	};

	const handleLoadMore = async () => {
		setInfo((prev) => ({ ...prev, dataLoading: true }));
		await fetchMoreGroupData(
			{
				pageId,
				databaseId,
				databaseViewId: viewId,
				input: {
					docLimit: 4,
					docPage: currentPage + 1,
					groupFilterId: groupData?._id || null,
				},
			},
			{
				blockId,
			},
		);
		setInfo((prev) => ({ ...prev, dataLoading: false }));
	};

	return (
		<div className={s.groupToggler}>
			{groupData && (
				<div className={s.groupTogglerHeader}>
					<button className={s.groupTogglerButton} onClick={handleToggle}>
						<ChevronSvg
							className={`${s.groupTogglerIcon} ${
								info?.isOpen ? s.groupTogglerIconOpen : ''
							}`}
						/>
					</button>
					{getGroupHeaderElement({
						label: groupData?.label || groupData?.name,
						type,
						color: groupData?.color,
					})}

					<span className={s.totalDocsCount}>
						{totalDocs} {totalDocs > 1 ? 'items' : 'item'}
					</span>
				</div>
			)}

			{info?.isOpen && (
				<>
					{children}
					{hasNextPage && (
						<div className={s.loadMoreContainer}>
							<button className={s.loadMoreButton} onClick={handleLoadMore}>
								{info?.dataLoading ? 'Loading...' : 'Load more'}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default memo(GroupToggler);

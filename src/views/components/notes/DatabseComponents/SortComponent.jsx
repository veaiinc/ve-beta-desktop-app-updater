import { memo, useContext, useMemo } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/sortComponent.module.scss';
import StatusDropdown from '../../dropDown/notes/database/StatusDropdown';
import { ReactComponent as SortDownIcon } from '../../../../assets/svg/tasks/sortDown.svg';
import { ReactComponent as SortUpIcon } from '../../../../assets/svg/tasks/sortUp.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/tasks/cross.svg';
import Context from '../../../../context/context';
const SortComponent = ({ databaseId, view, fields, pageId, blockId }) => {
	const {
		notes: { addSort, updateSort, removeSort },
	} = useContext(Context);

	const handleSortChange = (fieldId, direction, sortId = null) => {
		if (sortId) {
			updateSort(
				{
					pageId,
					databaseViewId: view?._id,
					databaseId,
					sortId,
					input: {
						direction,
						fieldId,
					},
				},
				blockId,
			);
		} else {
			addSort(
				{
					pageId,
					databaseViewId: view?._id,
					databaseId,
					input: {
						direction,
						fieldId,
					},
				},
				blockId,
			);
		}
	};

	const handleSortRemove = (sortId) => {
		removeSort(
			{
				pageId,
				databaseViewId: view?._id,
				databaseId,
				sortId,
			},
			blockId,
		);
	};

	const fieldMapper = useMemo(() => {
		return new Map(fields?.map((field) => [field?._id, field]));
	}, [fields]);

	return (
		<div className={s.sortComponentWrapper}>
			<div className={s.sortComponentHeader}>
				<div className={s.sortComponentHeaderTitle}>Sort</div>
				<StatusDropdown
					fields={fields}
					sorts={view?.sortBy}
					handleSortChange={handleSortChange}
				/>
			</div>
			<div className={s.sortComponentBody}>
				{view?.sortBy?.length > 0 ? (
					view?.sortBy?.map((sort) => {
						return (
							<div
								className={s.sortComponentBodyItem}
								onClick={() =>
									handleSortChange(
										sort?.fieldId,
										sort?.direction === 'ASC' ? 'DESC' : 'ASC',
										sort?._id,
									)
								}
							>
								<div className={s.sortComponentBodyItemValue}>
									{sort?.direction === 'ASC' ? <SortUpIcon /> : <SortDownIcon />}
								</div>
								<div className={s.sortComponentBodyItemTitle}>
									{fieldMapper?.get(sort?.fieldId)?.name}
								</div>

								<div
									className={s.sortComponentBodyItemRemove}
									onClick={(e) => {
										e.stopPropagation();
										handleSortRemove(sort?._id);
									}}
								>
									<CrossIcon />
								</div>
							</div>
						);
					})
				) : (
					<div className={s.noSort}>No Sort</div>
				)}
			</div>
		</div>
	);
};

export default memo(SortComponent);

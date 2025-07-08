import { memo, useMemo, useState } from 'react';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';
import s from '../../../../../assets/scss/notes/dropdown/statusDropdown.module.scss';
import { Tooltip } from 'antd';
const StatusDropdown = ({
	fields,
	sorts = [
		{
			fieldId: '6831836fd285feb91780934d',
			direction: 'DESC',
		},
	],
	handleSortChange,
}) => {
	const [info, setInfo] = useState({
		searchValue: '',
	});

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, searchValue: e.target.value }));
	};
	const filteredFields = useMemo(() => {
		return fields?.filter((field) =>
			field?.name?.toLowerCase().includes(info?.searchValue?.toLowerCase()),
		);
	}, [fields, info?.searchValue]);

	const selectedSorts = useMemo(() => {
		return new Map(sorts?.map((f) => [f.fieldId, f]));
	}, [sorts]);

	return (
		<Tooltip
			title={
				<div className={s.statusDropdownTooltip}>
					<div className={s.statusDropdownTooltipHeader}>
						<div className={s.statusDropdownSearchInput}>
							<SearchSvg className={s.statusDropdownSearchInputIcon} />
							<input
								type="text"
								className={s.statusDropdownInput}
								placeholder="Search..."
								value={info?.searchValue}
								onChange={handleSearch}
							/>
						</div>
					</div>
					<div className={s.statusDropdownTooltipBody}>
						{filteredFields?.length > 0 ? (
							filteredFields?.map((property) => {
								const isSelected = selectedSorts?.has(property?._id);
								return (
									<div
										key={property?._id}
										className={s.statusDropdownTooltipBodyItem}
										onClick={() =>
											isSelected
												? null
												: handleSortChange(property?._id, 'ASC')
										}
									>
										<div className={s.statusDropdownTooltipBodyItemIcon}>
											{property?.Icon && <property.Icon />}
										</div>
										<span className={s.statusDropdownTooltipBodyItemLabel}>
											{property?.name}
										</span>
										{isSelected && <Tick />}
									</div>
								);
							})
						) : (
							<div className={s.noOptionsText}>No options found</div>
						)}
					</div>
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomRight'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<button className={s.statusDropdownButton}>
				<PlusIcon />
			</button>
		</Tooltip>
	);
};

export default memo(StatusDropdown);

import { memo, useMemo } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';
import { Tooltip } from 'antd';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';

const SortDropdown = ({ properties, sort, handleSortChange }) => {
	const selectedSort = useMemo(() => {
		return new Map(sort?.map((s) => [s.sortBy, s]));
	}, [sort]);
	return (
		<Tooltip
			title={
				<div className="task-filter-dropdown-tooltip">
					<div className="filter-dropdown-tooltip-header">
						<div className="filter-search-input">
							<SearchSvg className="filter-search-input-icon" />
							<input type="text" className="filter-input" placeholder="Search..." />
						</div>
					</div>
					<div className="filter-dropdown-tooltip-body">
						{properties?.map((property) => (
							<div
								className="filter-dropdown-tooltip-body-item"
								onClick={() =>
									handleSortChange({ sortBy: property?.value, sortType: 1 })
								}
							>
								<div className="filter-dropdown-tooltip-body-item-icon">
									{property?.Icon && <property.Icon />}
								</div>
								<span className="filter-dropdown-tooltip-body-item-label">
									{property?.label}
								</span>
								{selectedSort?.has(property?.value) && <Tick />}
							</div>
						))}
					</div>
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomRight'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<button className="sort-filter-button">
				<PlusIcon />
			</button>
		</Tooltip>
	);
};

export default memo(SortDropdown);

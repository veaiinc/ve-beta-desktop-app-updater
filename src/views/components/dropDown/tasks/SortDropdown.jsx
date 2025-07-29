import { memo, useMemo, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';
import { Tooltip } from 'antd';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';

const tooltipStyles = {
	body: { minWidth: 'fit-content' },
};

const SortDropdown = ({ properties, sort, handleSortChange }) => {
	const [info, setInfo] = useState({
		searchValue: '',
	});

	const selectedSort = useMemo(() => {
		return new Map(sort?.map((s) => [s.sortBy, s]));
	}, [sort]);

	const handleSearch = (e) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			searchValue: e.target?.value,
		}));
	};

	const filteredProperties = useMemo(() => {
		return properties?.filter((property) => {
			return property?.label?.toLowerCase()?.includes(info?.searchValue?.toLowerCase());
		});
	}, [properties, info?.searchValue]);

	return (
		<Tooltip
			title={
				<div className="task-filter-dropdown-tooltip">
					<div className="filter-dropdown-tooltip-header">
						<div className="filter-search-input">
							<SearchSvg className="filter-search-input-icon" />
							<input
								type="text"
								className="filter-input"
								placeholder="Search..."
								value={info?.searchValue}
								onChange={handleSearch}
							/>
						</div>
					</div>
					<div className="filter-dropdown-tooltip-body">
						{filteredProperties?.length > 0 ? (
							filteredProperties?.map((property) => (
								<div
									className="filter-dropdown-tooltip-body-item"
									key={property?.value}
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
							))
						) : (
							<div className="no-options-text">No options found</div>
						)}
					</div>
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomRight'}
			styles={tooltipStyles}
		>
			<button className="sort-filter-button">
				<PlusIcon />
			</button>
		</Tooltip>
	);
};

export default memo(SortDropdown);

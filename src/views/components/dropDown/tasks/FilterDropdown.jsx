import { memo } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';

import { Tooltip } from 'antd';

const FilterDropdown = ({ properties }) => {
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
							<Tooltip
								title={property?.label}
								arrow={false}
								trigger={'click'}
								color={'red'}
								placement={'bottomRight'}
								overlayStyle={{ minWidth: 'fit-content' }}
							>
								<div className="filter-dropdown-tooltip-body-item">
									<div className="filter-dropdown-tooltip-body-item-icon">
										{property?.Icon && <property.Icon />}
									</div>
									<span className="filter-dropdown-tooltip-body-item-label">
										{property?.label}
									</span>
								</div>
							</Tooltip>
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
			<div className="filter-dropdown-btn">
				<FilterIcon />
			</div>
		</Tooltip>
	);
};

export default memo(FilterDropdown);

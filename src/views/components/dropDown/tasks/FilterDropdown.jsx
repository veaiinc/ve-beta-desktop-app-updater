import { memo } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';

import { Tooltip } from 'antd';
import TextFilter from './TextFilter';
import StatusDropdown from './StatusDropdown';

const FilterDropdown = ({ properties, colors, selected, responseMetadata }) => {
	const options = responseMetadata?.status?.props?.options;
	console.log(options);
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
								title={
									<div className="filter-dropdown-tooltip-body-item-dropdown">
										{/* <TextFilter /> */}
										<StatusDropdown
											colors={colors}
											options={options}
											selected={null}
											onOptionClick={() => {}}
											labelField={'label'}
										/>
									</div>
								}
								arrow={false}
								trigger={['click', 'hover']}
								color={'red'}
								placement={'right'}
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

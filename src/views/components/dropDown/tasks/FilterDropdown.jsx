import { memo } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFilter.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';

import { Tooltip } from 'antd';
import TextFilter from './TextFilter';
import StatusDropdown from './StatusDropdown';
import SelectDropdown from './SelectDropdown';
import PersonDropdown from './PersonDropdown';
import TeamMembersDropdown from './TeamMembersDropdown';

const filterMapper = {
	status: StatusDropdown,
	priority: SelectDropdown,
	clients: PersonDropdown,
	title: TextFilter,
	description: TextFilter,
	taskSlNo: TextFilter,
	assignedTo: TeamMembersDropdown,
	assignedBy: TeamMembersDropdown,
	createdBy: TeamMembersDropdown,
	updatedBy: TeamMembersDropdown,
};

const FilterDropdown = ({ properties, colors, selected, responseMetadata }) => {
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
						{properties?.map((property) => {
							const FilterComponent = filterMapper[property?.value] || TextFilter;

							return (
								<Tooltip
									destroyTooltipOnHide
									key={property?.value}
									title={
										<div className="filter-dropdown-tooltip-body-item-dropdown">
											<FilterComponent
												colors={colors}
												options={
													responseMetadata?.[property?.value]?.props
														?.options
												}
												selected={null}
												onOptionClick={() => {}}
												labelField="label"
												title={property?.label}
											/>
										</div>
									}
									arrow={false}
									trigger={['click', 'hover']}
									color="red"
									placement="rightTop"
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
							);
						})}
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

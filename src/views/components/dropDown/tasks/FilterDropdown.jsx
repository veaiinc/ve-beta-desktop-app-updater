import { memo, useMemo, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/filterDropdown.scss';
import PlusIcon from '../../../../assets/svg/tasks/plus.svg?react';
import SearchSvg from '../../../../assets/svg/workflow/search.svg?react';
import Tick from '../../../../assets/svg/tasks/tick.svg?react';
import { Tooltip } from 'antd';
import TextFilter from './TextFilter';
import StatusDropdown from './StatusDropdown';
import SelectDropdown from './SelectDropdown';
import PersonDropdown from './PersonDropdown';
import TeamMembersDropdown from './TeamMembersDropdown';
import DateViewDropdown from './DateViewDropdown';

const filterMapperTypes = {
	text: TextFilter,
	select: SelectDropdown,
	person: TeamMembersDropdown,
	date: DateViewDropdown,
	id: TextFilter,
	status: StatusDropdown,
	personMultiSelect: PersonDropdown,
};

const FilterDropdown = ({ properties, colors, filters, responseMetadata, handleFilterChange }) => {
	const [info, setInfo] = useState({
		searchValue: '',
	});

	const selectedFilters = useMemo(() => {
		return new Map(filters?.map((f) => [f.key, f]));
	}, [filters]);

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
							filteredProperties?.map((property) => {
								const FilterComponent =
									filterMapperTypes[property?.type] || TextFilter;

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
													onOptionClick={(option) => {
														handleFilterChange(property?.value, option);
													}}
													onChange={(option) => {
														handleFilterChange(property?.value, option);
													}}
													prefix={
														responseMetadata?.taskSlNo?.props?.prefix
													}
													labelField="label"
													title={property?.label}
													selected={
														[
															'assignedTo',
															'assignedBy',
															'createdBy',
															'updatedBy',
															'clients',
															'statusUpdatedBy',
														].includes(property?.value)
															? [
																	selectedFilters?.get(
																		property?.value,
																	)?.value,
															  ]
															: selectedFilters?.get(property?.value)
																	?.value
													}
													value={
														selectedFilters?.get(property?.value)?.value
													}
												/>
											</div>
										}
										arrow={false}
										trigger={['click', 'hover']}
										color="transparent"
										placement="rightTop"
										overlayStyle={{
											minWidth: 'fit-content',
											paddingLeft: '8px',
										}}
									>
										<div className="filter-dropdown-tooltip-body-item">
											<div className="filter-dropdown-tooltip-body-item-icon">
												{property?.Icon && <property.Icon />}
											</div>
											<span className="filter-dropdown-tooltip-body-item-label">
												{property?.label}
											</span>
											{selectedFilters?.has(property?.value) && <Tick />}
										</div>
									</Tooltip>
								);
							})
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
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<button className="sort-filter-button">
				<PlusIcon />
			</button>
		</Tooltip>
	);
};

export default memo(FilterDropdown);

import { memo, useMemo, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/filterDropdown.module.scss';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';
import { Tooltip } from 'antd';
import TextFilter from '../../tasks/TextFilter';
import StatusDropdown from '../../tasks/StatusDropdown';
import SelectDropdown from '../../tasks/SelectDropdown';
import PersonDropdown from '../../tasks/PersonDropdown';
import TeamMembersDropdown from '../../tasks/TeamMembersDropdown';
import DateViewDropdown from '../../tasks/DateViewDropdown';
import MultiSelectDropdown from '../../tasks/MultiSelectDropdown';

const filterMapperTypes = {
	text: TextFilter,
	select: MultiSelectDropdown,
	person: TeamMembersDropdown,
	created_by: TeamMembersDropdown,
	last_edited_by: TeamMembersDropdown,
	date: DateViewDropdown,
	id: TextFilter,
	status: StatusDropdown,
	personMultiSelect: PersonDropdown,
};

const FilterDropdown = ({ fields, colors, filters, handleFilterChange }) => {
	const [info, setInfo] = useState({
		searchValue: '',
	});

	const selectedFilters = useMemo(() => {
		return new Map(filters?.map((f) => [f.fieldId, f]));
	}, [filters]);

	const handleSearch = (e) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			searchValue: e.target?.value,
		}));
	};

	const filteredProperties = useMemo(() => {
		return fields?.filter((field) => {
			return field?.name?.toLowerCase()?.includes(info?.searchValue?.toLowerCase());
		});
	}, [fields, info?.searchValue]);

	return (
		<Tooltip
			title={
				<div className={s.taskFilterDropdownTooltip}>
					<div className={s.filterDropdownTooltipHeader}>
						<div className={s.filterSearchInput}>
							<SearchSvg className={s.filterSearchInputIcon} />
							<input
								type="text"
								className={s.filterInput}
								placeholder="Search..."
								value={info?.searchValue}
								onChange={handleSearch}
							/>
						</div>
					</div>
					<div className={s.filterDropdownTooltipBody}>
						{filteredProperties?.length > 0 ? (
							filteredProperties?.map((property) => {
								const FilterComponent =
									filterMapperTypes[property?.type] || TextFilter;

								return (
									<Tooltip
										destroyTooltipOnHide
										key={property?._id}
										title={
											<div
												className={s.filterDropdownTooltipBodyItemDropdown}
											>
												<FilterComponent
													colors={colors}
													options={
														property?.type === 'status'
															? property?.config?.status
															: property?.config?.options
													}
													onOptionClick={(option) => {
														handleFilterChange(
															property?._id,
															[option],
															property?.type,
														);
													}}
													onChange={(option) => {
														handleFilterChange(
															property?._id,
															option,
															property?.type,
														);
													}}
													prefix={
														property?.type === 'serial_number'
															? property?.config?.prefix
															: null
													}
													labelField="label"
													title={property?.name}
													selected={
														selectedFilters?.get(property?._id)?.value
													}
													value={
														selectedFilters?.get(property?._id)?.value
													}
													multiSelect={true}
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
										<div className={s.filterDropdownTooltipBodyItem}>
											<div className={s.filterDropdownTooltipBodyItemIcon}>
												{property?.Icon && <property.Icon />}
											</div>
											<span className={s.filterDropdownTooltipBodyItemLabel}>
												{property?.name}
											</span>
											{selectedFilters?.has(property?._id) && <Tick />}
										</div>
									</Tooltip>
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
			<button className={s.filterDropdownBtn}>
				<PlusIcon />
			</button>
		</Tooltip>
	);
};

export default memo(FilterDropdown);

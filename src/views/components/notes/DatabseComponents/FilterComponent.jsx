import { memo, useContext } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/filterComponent.module.scss';
import { getFilterConditions } from '../../../../helpers/databaseHelpers';
import FilterConditionDropdown from '../../dropDown/notes/database/FilterConditionDropdown';
import Context from '../../../../context/context';
import FilterDropdown from '../../dropDown/notes/database/FilterDropdown';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/tasks/cross.svg';
import { rowTypes } from '../Database';

const FilterComponent = ({ databaseId, view, fields, pageId, blockId }) => {
	const {
		notes: { addFilter, updateFilter, removeFilter },
	} = useContext(Context);
	const handleFilterChange = (key, value, fieldType, operator = null) => {
		const defaultOperator =
			operator ||
			getFilterConditions(fields?.find((field) => field?._id === key)?.type)?.[0]?.value;
		const payload = {
			pageId: pageId,
			databaseViewId: view?._id,
			databaseId,
			input: {
				fieldId: key,
				operator: defaultOperator,
				value: value,
				fieldType,
			},
		};

		const existingFilter = view?.filterBy?.find((filter) => filter.fieldId === key);
		if (existingFilter) {
			payload.filterId = existingFilter?._id;
			updateFilter(payload, blockId);
		} else {
			addFilter(payload, blockId);
		}
	};

	const deleteFilter = (filterId) => {
		removeFilter(
			{
				pageId,
				databaseViewId: view?._id,
				databaseId,
				filterId,
			},
			blockId,
		);
	};

	return (
		<div className={s.filterComponent}>
			<div className={s.filterComponentWrapper}>
				<div className={s.filterComponentHeader}>
					<div className={s.filterComponentHeaderTitle}>Filter</div>
					<div className={s.filterComponentHeaderButtons}>
						<FilterDropdown
							fields={fields}
							filters={view?.filterBy}
							handleFilterChange={handleFilterChange}
						/>
					</div>
					{/* <button className={s.filterComponentHeaderButton}>Clear All</button> */}
				</div>
				<div className={s.filterComponentBody}>
					{view?.filterBy?.length > 0 ? (
						view?.filterBy?.map((filter) => {
							const field = fields?.find((field) => field?._id === filter?.fieldId);
							const filterConditions = getFilterConditions(field?.type);
							const componentType =
								field?.type === 'select'
									? 'multi_select'
									: field?.type === 'status'
									? 'statusFilter'
									: field?.type === 'checkbox'
									? 'checkboxFilter'
									: field?.type === 'date'
									? 'dateFilter'
									: field?.type;
							const Component = rowTypes?.[componentType] || null;
							const currentField = fields?.find(
								(field) => field?._id === filter?.fieldId,
							);

							const options =
								currentField?.type === 'status'
									? currentField?.config?.status
									: currentField?.config?.options;

							return (
								<div className={s.filterComponentBodyItem} key={filter?.fieldId}>
									<div className={s.filterComponentBodyItemTitle}>
										{field?.name}
									</div>
									<FilterConditionDropdown
										conditions={filterConditions}
										selectedCondition={filter?.operator}
										onChange={(condition) => {
											handleFilterChange(
												filter?.fieldId,
												filter?.value,
												field?.type,
												condition,
											);
										}}
									>
										<div className={s.filterComponentBodyItemCondition}>
											{
												filterConditions?.find(
													(condition) =>
														condition?.value === filter?.operator,
												)?.label
											}
										</div>
									</FilterConditionDropdown>

									<div className={s.filterComponentBodyItemValue}>
										{Component &&
											!filterConditions?.find(
												(condition) =>
													condition?.value === filter?.operator,
											)?.noValue && (
												<Component
													value={filter?.value}
													options={options}
													labelField={'label'}
													title={field?.name}
													showLabel={true}
													multiSelect={true}
													onOptionClick={(value) => {
														handleFilterChange(
															filter?.fieldId,
															value,
															field?.type,
															filter?.operator,
														);
													}}
													onChange={(value) => {
														handleFilterChange(
															filter?.fieldId,
															value,
															field?.type,
															filter?.operator,
														);
													}}
													linkType={field?.type}
													showStartEnd={field?.type === 'date'}
												/>
											)}
									</div>
									<button
										className={s.filterComponentBodyItemDelete}
										onClick={() => {
											deleteFilter(filter?._id);
										}}
									>
										<CrossIcon />
									</button>
								</div>
							);
						})
					) : (
						<div className={s.noFilter}>No Filter</div>
					)}
				</div>
			</div>
			{/* <div className={s.filterComponentWrapper}>
				<div className={s.filterComponentHeader}>
					<div className={s.filterComponentHeaderTitle}>Sort</div>
					<div className={s.filterComponentHeaderButtons}>
						<button className={s.filterComponentHeaderButton}>+</button>
					</div>
				</div>
				<div className={s.filterComponentBody}>
					<div className={s.filterComponentBodyItem}>
						<div className={s.filterComponentBodyItemTitle}>CreatedAt</div>
						<div className={s.filterComponentBodyItemValue}>Asc</div>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default memo(FilterComponent);

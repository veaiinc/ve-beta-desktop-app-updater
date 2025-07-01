import { memo, useState, useEffect, useCallback } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/statusFilterDropdown.module.scss';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const StatusFilterDropdown = ({ options, title, onChange, value = { labels: [], groups: [] } }) => {
	const [selectedState, setSelectedState] = useState({
		labels: value.labels || [],
		groups: value.groups || [],
	});

	// Transform options for Ant Design Checkbox
	const transformedOptions = {
		todo: options.todo.map((item) => ({ label: item.label, value: item._id })),
		inProgress: options.inProgress.map((item) => ({ label: item.label, value: item._id })),
		completed: options.completed.map((item) => ({ label: item.label, value: item._id })),
	};

	// Sync local state with external value only when they actually differ
	useEffect(() => {
		const newLabels = value?.labels || [];
		const newGroups = value?.groups || [];

		if (
			JSON.stringify(newLabels) !== JSON.stringify(selectedState.labels) ||
			JSON.stringify(newGroups) !== JSON.stringify(selectedState.groups)
		) {
			setSelectedState({ labels: newLabels, groups: newGroups });
		}
	}, [value?.labels, value?.groups]);

	// Handle group checkbox change (all selected / unselected)
	const handleGroupChange = useCallback(
		(groupName, checked) => {
			setSelectedState((prev) => {
				const groupValues = transformedOptions[groupName].map((opt) => opt.value);
				const newGroups = checked
					? [...prev.groups, groupName]
					: prev.groups.filter((g) => g !== groupName);
				const newLabels = checked
					? prev.labels.filter((label) => !groupValues.includes(label))
					: prev.labels;

				const newState = { groups: newGroups, labels: newLabels };
				setTimeout(() => onChange?.(newState), 0);
				return newState;
			});
		},
		[onChange, transformedOptions],
	);

	// Handle individual checkbox group item selection
	const handleCheckboxChange = useCallback(
		(groupName, values) => {
			setSelectedState((prev) => {
				const groupValues = transformedOptions[groupName].map((opt) => opt.value);
				const allSelected = values.length === groupValues.length;

				const newGroups = allSelected
					? [...prev.groups, groupName]
					: prev.groups.filter((g) => g !== groupName);

				const newLabels = allSelected
					? prev.labels.filter((label) => !groupValues.includes(label))
					: [...prev.labels.filter((label) => !groupValues.includes(label)), ...values];

				const newState = { groups: newGroups, labels: newLabels };
				setTimeout(() => onChange?.(newState), 0);
				return newState;
			});
		},
		[onChange, transformedOptions],
	);

	const isGroupChecked = useCallback(
		(groupName) => selectedState.groups.includes(groupName),
		[selectedState.groups],
	);

	const getGroupIndeterminate = useCallback(
		(groupName) => {
			const groupOptions = transformedOptions[groupName];
			const selectedCount = groupOptions.filter((option) =>
				selectedState.labels.includes(option.value),
			).length;
			return selectedCount > 0 && selectedCount < groupOptions.length;
		},
		[selectedState.labels, transformedOptions],
	);

	const getGroupSelectedValues = useCallback(
		(groupName) => {
			if (selectedState.groups.includes(groupName)) {
				return transformedOptions[groupName].map((option) => option.value);
			}
			return transformedOptions[groupName]
				.filter((option) => selectedState.labels.includes(option.value))
				.map((option) => option.value);
		},
		[selectedState.groups, selectedState.labels, transformedOptions],
	);

	return (
		<div className={s.statusFilterDropdown}>
			<div className={s.topSection}>
				<div className={s.topSectionTitle}>{title}</div>
			</div>
			{Object.entries(transformedOptions).map(([groupName, options]) => (
				<div key={groupName} className={s.bodySection}>
					<div className={s.groupHeader}>
						<Checkbox
							indeterminate={getGroupIndeterminate(groupName)}
							onChange={(e) => handleGroupChange(groupName, e.target.checked)}
							checked={isGroupChecked(groupName)}
						>
							<div className={s.groupHeaderTitle}>
								{groupName.charAt(0).toUpperCase() + groupName.slice(1)}
							</div>
						</Checkbox>
					</div>
					<div className={s.groupBody}>
						<CheckboxGroup
							options={options}
							value={getGroupSelectedValues(groupName)}
							onChange={(values) => handleCheckboxChange(groupName, values)}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
								paddingLeft: '24px',
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(StatusFilterDropdown);

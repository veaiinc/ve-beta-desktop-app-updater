import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/calendar/attendeeSelector.scss';
import { Select } from 'antd';

const MultiCategorySelector = ({ options, value = [], onChange, className }) => {
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValues: [],
	});

	// Format options similar to CategorySelector
	useEffect(() => {
		const formattedOptions = options?.map((option) => ({
			value: option?._id,
			label: `${option?.firstName || ''} ${option?.lastName || ''}`.trim() || option?.email,
			email: option?.email,
			role: option?.role,
		}));
		setInfo((prev) => ({ ...prev, formattedOptions }));
	}, [options]);

	// Format values for multiple selections
	useEffect(() => {
		const formattedValues = value?.map((item) => item?.tenantUserId || '');
		setInfo((prev) => ({ ...prev, formattedValues }));
	}, [value]);

	// Custom tag render for selected items
	const tagRender = ({ label, value: tagValue, closable, onClose }) => {
		const option = info?.formattedOptions?.find((opt) => opt?.value === tagValue);
		const firstLetter = option?.label?.charAt(0).toUpperCase() || '';
		return (
			<div className="custom-tag">
				<span className="profile-icon">{firstLetter}</span>
				<span className="tag-name">{label}</span>
				{closable && (
					<span className="tag-close" onClick={onClose}>
						×
					</span>
				)}
			</div>
		);
	};

	// Custom render for dropdown options
	const optionRender = (option) => {
		return (
			<div className="option-container">
				<div className="option-name">{option?.label}</div>
				{/* <div className="option-email">{option?.data?.email}</div> */}
			</div>
		);
	};

	// Handle max tag display
	const maxTagPlaceholder = (omittedValues) => {
		return <span>+ {omittedValues?.length || 0}...</span>;
	};

	useEffect(() => {
		console.log('info.formattedOptions===>', JSON.stringify(info?.formattedOptions, null, 2));
		console.log('info.formattedValues===>', JSON.stringify(info?.formattedValues, null, 2));
		console.log('options===>', JSON.stringify(options, null, 2));
		console.log('value===>', JSON.stringify(value, null, 2));
	}, [info, options, value]);

	return (
		<div className={`multi-category-selector ${className}`}>
			<Select
				mode="multiple"
				variant="borderless"
				value={info?.formattedValues}
				options={info?.formattedOptions || []}
				onChange={(selectedValues) => {
					const selectedOptions = selectedValues?.map((selectedValue) => {
						const option = options?.find((opt) => opt?._id === selectedValue);
						return {
							tenantUserId: option?._id || null,
							email: option?.email || null,
							isWorkspaceUser: true,
							responseStatus: 'confirmed',
							name: `${option?.firstName || ''} ${option?.lastName || ''}`.trim(),
							role: option?.role || null,
						};
					});
					onChange(selectedOptions);
				}}
				placeholder="Select users"
				// maxTagCount={1}
				maxTagPlaceholder={maxTagPlaceholder}
				tagRender={tagRender}
				optionRender={optionRender}
				optionFilterProp="label"
				showSearch
				filterOption={(input, option) =>
					(option?.label?.toLowerCase() || '').includes(input.toLowerCase()) ||
					(option?.email?.toLowerCase() || '').includes(input.toLowerCase())
				}
			/>
		</div>
	);
};

export default memo(MultiCategorySelector);

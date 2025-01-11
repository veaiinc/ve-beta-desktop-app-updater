import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/calendar/attendeeSelector.scss';
import { Select } from 'antd';

const AttendeeSelector = ({ options, value = [], onChange, className }) => {
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValues: [],
	});

	// Format options and values
	useEffect(() => {
		const formattedOptions = options?.map((option) => ({
			value: option?._id,
			label: `${option?.firstName || ''} ${option?.lastName || ''}`.trim() || option?.email,
			email: option?.email,
			role: option?.role,
		}));

		const formattedValues = value?.map((item) => ({
			value: item?.tenantUserId || item?.email,
			label: item?.name || item?.email,
		}));

		setInfo({
			formattedOptions: formattedOptions || [],
			formattedValues: formattedValues || [],
		});
	}, [options, value]);

	// Memoize tagRender since it depends on info.formattedOptions
	const tagRender = useCallback(
		({ label, value: tagValue, closable, onClose }) => {
			const option = info?.formattedOptions?.find((opt) => opt?.value === tagValue);
			const firstLetter = option?.label?.charAt(0).toUpperCase() || '';
			return (
				<div className="custom-tag">
					<span className="profile-icon">{firstLetter || '👤'}</span>
					<span className="tag-name">{label}</span>
					{closable && (
						<span className="tag-close" onClick={onClose}>
							×
						</span>
					)}
				</div>
			);
		},
		[info.formattedOptions],
	);

	// Custom render for dropdown options
	const optionRender = (option) => {
		const firstLetter = option?.label?.charAt(0).toUpperCase() || '';
		return (
			<div className="option-container">
				<span className="option-icon">{firstLetter || '👤'}</span>
				<span className="option-name">{option?.label}</span>
			</div>
		);
	};

	// Handle max tag display : not using
	const maxTagPlaceholder = (omittedValues) => {
		return <span>+ {omittedValues?.length || 0}...</span>;
	};

	const handleChange = useCallback(
		(selectedValues) => {
			const selectedOptions = selectedValues?.map((selectedValue) => {
				const option = options?.find(
					(opt) =>
						// Match by either tenantUserId or email
						opt?._id === selectedValue || opt?.email === selectedValue,
				);
				return {
					tenantUserId: option?._id || null,
					email: option?.email || selectedValue,
					isWorkspaceUser: Boolean(option?._id),
					responseStatus: 'confirmed',
					name: option
						? `${option?.firstName || ''} ${option?.lastName || ''}`.trim()
						: null,
					role: option?.role || null,
				};
			});
			onChange(selectedOptions);
		},
		[options, onChange],
	);

	return (
		<div className={`multi-category-selector ${className}`}>
			<Select
				mode="multiple"
				variant="borderless"
				value={info.formattedValues}
				options={info.formattedOptions}
				onChange={handleChange}
				placeholder="Add attendees"
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
				getPopupContainer={(trigger) => trigger?.parentNode}
			/>
		</div>
	);
};

export default memo(AttendeeSelector);

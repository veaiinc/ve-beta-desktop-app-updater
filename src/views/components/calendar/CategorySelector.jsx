import React, { memo, useMemo } from 'react';
import '../../../assets/scss/calendar/categorySelector.scss';
import { Select } from 'antd';

const CategorySelector = ({ options, value, onChange, className }) => {
	const formattedOptions = useMemo(
		() =>
			options.map((option) => ({
				value: option?._id,
				label: option?.name,
				color: option?.color,
			})),
		[options],
	);
	const formattedValue = useMemo(() => value?.name, [value]);
	console.log('value?.name', JSON.stringify(value));
	console.log('formattedValue', formattedValue);
	return (
		<div className={`category-selector ${className}`}>
			<Select
				value={formattedValue}
				options={formattedOptions || []}
				onChange={(selectedValue) => {
					const selectedOption = formattedOptions?.find(
						(opt) => opt?._id === selectedValue?.value,
					);
					console.log('selectedOption', JSON.stringify(selectedOption));
					onChange(selectedOption);
				}}
				variant="borderless"
				placeholder="Empty"
			/>
		</div>
	);
};

export default memo(CategorySelector);

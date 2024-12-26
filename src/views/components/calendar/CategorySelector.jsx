import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/calendar/categorySelector.scss';
import { Select } from 'antd';

const CategorySelector = ({ options, value, onChange, className }) => {
	const [info, setInfo] = useState({
		formattedOptions: [],
		formattedValue: value?.name,
	});
	useEffect(() => {
		const formattedOptions = options.map((option) => ({
			value: option?._id,
			label: option?.name,
			color: option?.color,
		}));
		setInfo((prev) => ({ ...prev, formattedOptions }));
	}, [options]);

	useEffect(() => {
		const formattedValue = value?.name ? value?.name : 'default';
		setInfo((prev) => ({ ...prev, formattedValue }));
	}, [value]);

	const customLabel = (props) => {
		const option = info?.formattedOptions?.find((option) => option?.label === props?.value);
		return (
			<div className="category-label" style={{ backgroundColor: option?.color }}>
				{option?.label || 'Empty'}
			</div>
		);
	};

	const customOption = (option) => {
		return (
			<div className="category-label" style={{ backgroundColor: option?.data?.color }}>
				{option?.label || 'Empty'}
			</div>
		);
	};

	return (
		<div className={`category-selector ${className}`}>
			<Select
				value={info?.formattedValue}
				options={info?.formattedOptions || []}
				onChange={(selectedValue) => {
					const selectedOption = options?.find((option) => option?._id === selectedValue);
					if (selectedOption) {
						onChange(selectedOption);
					}
				}}
				variant="borderless"
				placeholder="Empty"
				labelRender={customLabel}
				optionRender={customOption}
			/>
		</div>
	);
};

export default memo(CategorySelector);

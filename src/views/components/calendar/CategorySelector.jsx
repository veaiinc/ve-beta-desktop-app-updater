import React, { memo, useEffect, useMemo, useState } from 'react';
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
			name: option?.name,
		}));
		setInfo((prev) => ({ ...prev, formattedOptions }));
	}, [options]);

	useEffect(() => {
		const formattedValue = value?.name;
		setInfo((prev) => ({ ...prev, formattedValue }));
	}, [value]);

	return (
		<div className={`category-selector ${className}`}>
			<Select
				value={info?.formattedValue}
				options={info?.formattedOptions || []}
				onChange={(selectedValue) => {
					const selectedOption = info?.formattedOptions?.filter(
						(ele) => ele?.value === selectedValue,
					);

					onChange(selectedOption?.[0]);
				}}
				variant="borderless"
				placeholder="Empty"
			/>
		</div>
	);
};

export default memo(CategorySelector);

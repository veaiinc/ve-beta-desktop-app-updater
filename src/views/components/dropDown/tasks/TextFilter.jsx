import { memo, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/textFilter.scss';

const TextFilter = ({ value = '', onChange = () => {}, title = 'Text' }) => {
	const debounceRef = useRef(null);

	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			onChange(newValue);
		}, 500);
	};

	return (
		<div className="filter-dropdown-text-filter">
			<div className="filter-dropdown-text-filter-title">{title}</div>
			<input
				className="filter-dropdown-text-filter-input"
				placeholder="Add Filter"
				value={inputValue}
				onChange={handleChange}
			/>
		</div>
	);
};

export default memo(TextFilter);

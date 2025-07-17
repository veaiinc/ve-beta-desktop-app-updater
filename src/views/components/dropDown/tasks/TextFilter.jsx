import { memo, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/textFilter.scss';

const TextFilter = ({ value = '', onChange = () => {}, title = 'Text', prefix = '' }) => {
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
		<div className="filter-dropdown-text-filter" onClick={(e) => e.stopPropagation()}>
			<div className="filter-dropdown-text-filter-title">{title}</div>
			<div className="filter-dropdown-text-filter-input-container">
				{title === 'Id' ? `${prefix} - ` : ''}
				<input
					className="filter-dropdown-text-filter-input"
					placeholder={title === 'Id' ? '' : 'Add Filter'}
					value={inputValue}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default memo(TextFilter);

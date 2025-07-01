import { memo, useEffect, useRef, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/numberFilterDropdown.module.scss';

const NumberFilterDropdown = ({ value = '', onChange = () => {}, title = 'Number' }) => {
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
			onChange(newValue === '' ? '' : Number(newValue));
		}, 500);
	};

	return (
		<div className={s.numberFilterDropdown} onClick={(e) => e.stopPropagation()}>
			<div className={s.numberFilterDropdownTitle}>{title}</div>
			<div className={s.numberFilterDropdownInputContainer}>
				<input
					className={s.numberFilterDropdownInput}
					type="number"
					step="any"
					placeholder="Add Filter"
					value={inputValue}
					onChange={handleChange}
					min="-999999999"
					max="999999999"
				/>
			</div>
		</div>
	);
};

export default memo(NumberFilterDropdown);

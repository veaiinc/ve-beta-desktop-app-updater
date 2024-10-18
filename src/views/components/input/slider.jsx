import React, { useEffect, useState, memo } from 'react';
import '../../../assets/scss/inputComponent.scss';

const ToggleSlider = ({ onChange, value, editable = true }) => {
	const [checked, setChecked] = useState(value || false);
	useEffect(() => {
		setChecked(value);
	}, [value]);

	const handleToggle = () => {
		if (!editable) {
			return;
		}
		const newValue = !checked;
		setChecked(newValue);
		onChange(newValue);
	};

	return (
		<label className="toggleSwitch">
			<input type="checkbox" checked={checked} onChange={handleToggle} />
			<span className="slider " style={{ padding: '0px' }}></span>
		</label>
	);
};

export default memo(ToggleSlider);

import React, { useEffect, useState, memo } from 'react';
import '../../../assets/scss/inputComponent.scss';

const ToggleSlider = ({ onChange, value }) => {
	const [checked, setChecked] = useState(value || false);
	useEffect(() => {
		setChecked(value);
	}, [value]);

	const handleToggle = () => {
		const newValue = !checked;
		setChecked(newValue);
		onChange(newValue);
	};

	return (
		<label className="toggleSwitch">
			<input type="checkbox" checked={checked} onChange={handleToggle} />
			<span className="slider round" style={{ padding: '0px' }}></span>
		</label>
	);
};

export default memo(ToggleSlider);

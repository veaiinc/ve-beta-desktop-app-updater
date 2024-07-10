import React, { useEffect, useState } from 'react';
import '../../../assets/scss/inputComponent.scss';

const ToggleSlider = ({ onChange, value }) => {
	const [checked, setChecked] = useState(value || false);

	const handleToggle = () => {
		const newValue = !checked;
		setChecked(newValue);
		onChange(newValue);
	};

	return (
		<label className="toggleSwitch">
			<input type="checkbox" checked={checked} onChange={handleToggle} />
			<span className="slider round"></span>
		</label>
	);
};

export default ToggleSlider;

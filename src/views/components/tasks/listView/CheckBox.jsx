import { useState, memo, useEffect } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const CheckBox = ({ value, onChange }) => {
	const [info, setInfo] = useState({ checked: value });
	useEffect(() => {
		setInfo({ checked: value });
	}, [value]);
	const updateCheckBoxInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
		onChange(value);
	};
	return (
		<div
			className={`listItem-checkBox ${info?.checked ? 'checked' : ''}`}
			onClick={(e) => {
				e.stopPropagation();
				updateCheckBoxInfo('checked', !info?.checked);
			}}
		>
			{info?.checked ? '✓' : ''}
		</div>
	);
};

export default memo(CheckBox);

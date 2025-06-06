import { useState, memo, useEffect } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';

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
			className="listItem-checkBox"
			onClick={(e) => {
				e.stopPropagation();
				updateCheckBoxInfo('checked', !info?.checked);
			}}
		>
			{info?.checked ? <Check /> : ''}
		</div>
	);
};

export default memo(CheckBox);

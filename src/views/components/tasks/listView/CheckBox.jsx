import React, { useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';

const CheckBox = ({ value }) => {
	const [info, setInfo] = useState({ checked: value });
	const updateCheckBoxInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};
	return (
		<div
			className="listItem-checkBox"
			onClick={() => updateCheckBoxInfo('checked', !info?.checked)}
		>
			{info?.checked ? <Check /> : ''}
		</div>
	);
};

export default CheckBox;

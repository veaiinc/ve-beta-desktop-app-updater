import React, { useState } from 'react';
import { ReactComponent as Circle } from '../../../../assets/svg/tasks/circleBigDash.svg';
import { ReactComponent as UpArrowDouble } from '../../../../assets/svg/tasks/upArrowDouble.svg';
import { ReactComponent as UpArrow } from '../../../../assets/svg/tasks/upArrowRed.svg';
import { ReactComponent as ParallelLines } from '../../../../assets/svg/tasks/parallelLines.svg';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrowGreen.svg';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import DropDown from '../../dropDown/tasks/DropDown';

const Priority = ({ value }) => {
	const [info, setInfo] = useState({
		options: [
			{
				label: 'no priority',
				icon: <Circle />,
			},
			{
				label: 'critical',
				icon: <UpArrowDouble />,
			},
			{
				label: 'high',
				icon: <UpArrow />,
			},
			{
				label: 'medium',
				icon: <ParallelLines />,
			},
			{
				label: 'low',
				icon: <DownArrow />,
			},
		],
		isDropdownOpen: false,
	});

	const updatePropertyInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	return (
		<div className="priority">
			<DropDown title={'Change priority'} open={info?.isDropdownOpen} options={info?.options}>
				<div
					className="currentIcon"
					onClick={() => updatePropertyInfo('isDropdownOpen', !info?.isDropdownOpen)}
				>
					{info?.options.find((item) => item?.label === value)?.icon}
				</div>
			</DropDown>
		</div>
	);
};

export default Priority;

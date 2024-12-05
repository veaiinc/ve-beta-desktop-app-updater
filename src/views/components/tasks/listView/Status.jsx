import React, { useState } from 'react';

import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as CheckGreen } from '../../../../assets/svg/tasks/checkGreen.svg';
import { ReactComponent as Timer } from '../../../../assets/svg/tasks/timer.svg';
import { ReactComponent as Spinner } from '../../../../assets/svg/tasks/spinner.svg';
import { ReactComponent as CircleHollow } from '../../../../assets/svg/tasks/circleHollowThin.svg';
import { ReactComponent as Cross } from '../../../../assets/svg/tasks/cross.svg';

const Status = ({ value }) => {
	const [info, setInfo] = useState({
		options: [
			{
				label: 'Backlog',
				icon: <Spinner />,
			},
			{
				label: 'Todo',
				icon: <CircleHollow />,
			},
			{
				label: 'In progress',
				icon: <Timer />,
			},
			{
				label: 'Done',
				icon: <CheckGreen />,
			},
			{
				label: 'Canceled',
				icon: <Cross />,
			},
		],
		isDropdownOpen: false,
	});

	const updateStatusInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	return (
		<div className="status">
			<div
				className="currentIcon"
				onClick={() => updateStatusInfo('isDropdownOpen', !info?.isDropdownOpen)}
			>
				{info?.options.find((item) => item.label === value)?.icon}
			</div>
			{info?.isDropdownOpen ? (
				<div className="dropdownContainer">
					<h3>Change status</h3>
					<ul>
						{info?.options?.map((option, index) => (
							<li key={index}>
								<div className="optionDetails">
									<div className="icon">{option.icon}</div>
									<div className="labelText">{option.label}</div>
								</div>
								{info?.options.find((item) => item.label === value)?.label ===
								option?.label ? (
									<Check />
								) : (
									''
								)}
							</li>
						))}
					</ul>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default Status;

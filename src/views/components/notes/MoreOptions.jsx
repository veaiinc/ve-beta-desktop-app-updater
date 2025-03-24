import React, { useState } from 'react';
import { Tooltip, Switch } from 'antd';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import DuplicateSvg from '../../../assets/svg/tasks/DuplicateSvg.jsx';
import '../../../assets/scss/notes/noteComponent.scss';

const options = [
	// {
	// 	id: 'smallText',
	// 	label: 'Small text',
	// 	toggler: true,
	// 	// icon: <SmallTextSvg />,
	// },
	{
		id: 'fullWidth',
		label: 'Full width',
		toggler: true,
		// icon: <FullWidthSvg />,
	},
	{
		id: 'duplicate',
		label: 'Duplicate',
		icon: <DuplicateSvg />,
	},
];
const fontOptions = [
	{
		id: '1',
		label: 'Default',
	},
	{
		id: '2',
		label: 'Serif',
	},
	{
		id: '3',
		label: 'Mono',
	},
];

const MoreOptions = ({ notesConfigs, onChange, onDelete, onDuplicate }) => {
	const [info, setInfo] = useState({ isOpen: false });

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleOptionClick = (option) => {
		if (option?.id === 'duplicate') {
			onDuplicate();
		}
	};

	return (
		<div className="more-options-container">
			<Tooltip
				placement="bottomRight"
				open={info?.openMoreOptions}
				onOpenChange={(open) => {
					if (!open) {
						handleInfoChange({ openMoreOptions: false });
					}
				}}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
				title={
					<div className="notes-more-options-tooltip-content">
						{options?.map((option) => (
							<div
								className={`items ${!option?.toggler ? 'cursor-pointer' : ''}`}
								key={option.id}
								onClick={() => handleOptionClick(option)}
							>
								{option?.icon}
								<span className="more-options-label">{option?.label}</span>
								{option?.toggler && (
									<Switch
										checked={notesConfigs?.[option?.id]}
										onChange={(checked) =>
											onChange(option?.id, !notesConfigs?.[option?.id])
										}
										size="small"
									/>
								)}
							</div>
						))}
						<hr style={{ width: '100%', opacity: 0.1 }} />
						<div className="deleteItem cursor-pointer" onClick={onDelete}>
							<DeleteSvg />
							<span>Delete</span>
						</div>
					</div>
				}
			>
				<DotsSvg
					onClick={() => handleInfoChange({ openMoreOptions: !info.openMoreOptions })}
				/>
			</Tooltip>
		</div>
	);
};

export default MoreOptions;

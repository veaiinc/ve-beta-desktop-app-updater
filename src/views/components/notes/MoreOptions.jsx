import React, { useState } from 'react';
import { Tooltip, Switch } from 'antd';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import DuplicateSvg from '../../../assets/svg/tasks/DuplicateSvg.jsx';
import '../../../assets/scss/notes/noteComponent.scss';

const options = [
	{
		id: 'smallText',
		label: 'Small text',
		toggler: true,
		// icon: <SmallTextSvg />,
	},
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
	{
		id: 'share',
		label: 'Share',
		icon: <ShareSvg />,
	},
];
const MoreOptions = ({ notesConfigs, onChange }) => {
	const [info, setInfo] = useState({ isOpen: false });

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
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
							<div className="items" key={option.id} onClick={() => {}}>
								{option?.icon}
								<span>{option?.label}</span>
								{option?.toggler && (
									<Switch
										checked={notesConfigs?.[option?.id]}
										onChange={(checked) => onChange(option?.id, checked)}
									/>
								)}
							</div>
						))}
						<hr style={{ width: '100%', opacity: 0.1 }} />
						<div className="deleteItem" onClick={() => {}}>
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

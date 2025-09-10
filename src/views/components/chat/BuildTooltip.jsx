import { memo, useContext } from 'react';
import '../../../assets/scss/chat/buildTooltip.scss';
import { Tooltip } from 'antd';
import Context from '../../../context/context';

const buildOptions = [
	{ id: 1, title: 'Create form', chatText: 'Create a form for ' },
	{ id: 2, title: 'Create contract', chatText: 'Create a contract for ' },
	{
		id: 3,
		title: 'Create invoice',
		chatText: 'Create an invoice for ',
	},
	{
		id: 4,
		title: 'Create agent',
		chatText: 'Create an agent for ',
	},
];

const BuildTooltip = ({ children }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const handleOptionClick = (e, option) => {
		e?.stopPropagation();
		updateStateValues({
			activeInputForChat: option?.chatText,
		});
	};
	return (
		<Tooltip
			placement="bottom"
			trigger="click"
			rootClassName="build-tooltip-wrapper"
			arrow={false}
			color="transparent"
			title={
				<div className="build-tooltip-container">
					{buildOptions?.map((option) => (
						<div
							className="option"
							key={option?.id}
							onClick={(e) => handleOptionClick(e, option)}
						>
							{option?.title || ''}
						</div>
					))}
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(BuildTooltip);

import { memo, useContext } from 'react';
import '../../../assets/scss/chat/buildTooltip.scss';
import { ReactComponent as AgentSvg } from '../../../assets/svg/chat/agent.svg';
import { ReactComponent as FilesSvg } from '../../../assets/svg/chat/files.svg';
import { ReactComponent as InvoiceSvg } from '../../../assets/svg/chat/invoice.svg';
import { ReactComponent as ContractSvg } from '../../../assets/svg/chat/contract.svg';
import { Tooltip } from 'antd';
import Context from '../../../context/context';

const buildOptions = [
	{
		id: 1,
		title: 'Create form',
		chatText: 'Create a form for ',
		subTitle: 'Instant smart forms',
		icon: <FilesSvg />,
	},
	{
		id: 2,
		title: 'Create contract',
		chatText: 'Create a contract for ',
		subTitle: 'Draft and sign',
		icon: <ContractSvg />,
	},
	{
		id: 3,
		title: 'Create invoice',
		chatText: 'Create an invoice for ',
		subTitle: 'Bill and track',
		icon: <InvoiceSvg />,
	},
	{
		id: 4,
		title: 'Create agent',
		chatText: 'Create an agent for ',
		subTitle: 'Smart task automation',
		icon: <AgentSvg />,
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
							<div className="left-container">
								<div className="icon-container">{option?.icon}</div>
							</div>

							<div className="right-container">
								<div className="title">{option?.title}</div>
								<div className="subtitle">{option?.subTitle}</div>
							</div>
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

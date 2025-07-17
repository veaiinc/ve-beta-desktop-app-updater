import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/automation_builder/connector.scss';
import ConnectorSvg from '../../../assets/svg/worflow_builder/connector';
import PlusSvg from '../../../assets/svg/worflow_builder/plus';
const WorkflowConnector = ({ alterData, index }) => {
	const [info, setInfo] = useState({
		connectorHeight: 64,
		buttonDisplay: false,
		fillOpacity: '0.32',
	});

	const containerMouseHover = useCallback(() => {
		if (index === 0) {
			return;
		}
		// setInfo((prev) => ({ ...prev, connectorHeight: 116, buttonDisplay: true }));
	}, [index]);

	const containerMouseLeave = useCallback(() => {
		setInfo((prev) => ({ ...prev, connectorHeight: 64, buttonDisplay: false }));
	}, []);

	const plusBtnHover = useCallback((type) => {
		if (type) {
			setInfo((prev) => ({ ...prev, fillOpacity: '0.72' }));
		} else {
			setInfo((prev) => ({ ...prev, fillOpacity: '0.32' }));
		}
	}, []);

	const addNewCard = useCallback(() => {
		alterData(index + 1, {
			label: 'Reminder Email template',
			title: 'Send Reminder Email',
			actions: [{ name: 'Edit Email' }],
			subLabel: 'Wait for 2 hours after Proposal is sent and then wait for my approval',
		});
		setInfo((prev) => ({
			...prev,
			fillOpacity: '0.32',
			connectorHeight: 64,
			buttonDisplay: false,
		}));
	}, [info?.buttonDisplay, info?.connectorHeight]);

	return (
		<div
			className="workflowConnectorContainer"
			onMouseEnter={containerMouseHover}
			onMouseLeave={containerMouseLeave}
		>
			{info?.buttonDisplay ? (
				<>
					<ConnectorSvg />
					<div
						className="plusBtnContainer"
						onMouseEnter={() => plusBtnHover(true)}
						onMouseLeave={() => plusBtnHover(false)}
						onClick={addNewCard}
					>
						<PlusSvg fillOpacity={info?.fillOpacity} />
					</div>
					<ConnectorSvg />
				</>
			) : (
				<ConnectorSvg />
			)}
		</div>
	);
};

export default memo(WorkflowConnector);

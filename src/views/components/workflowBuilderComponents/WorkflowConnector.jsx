import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/workflowBuilder/connector.scss';
import ConnectorSvg from '../../../assets/svg/worflow_builder/connector';
import PlusSvg from '../../../assets/svg/worflow_builder/plus';
const WorkflowConnector = () => {
	const [info, setInfo] = useState({
		connectorHeight: 64,
		buttonDisplay: false,
		fillOpacity: '0.32',
	});

	const containerMouseHover = useCallback(() => {
		setInfo((prev) => ({ ...prev, connectorHeight: 116, buttonDisplay: true }));
	}, []);

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

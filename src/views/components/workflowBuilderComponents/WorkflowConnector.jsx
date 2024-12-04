import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/workflowBuilder/connector.scss';
import ConnectorSvg from '../../../assets/svg/worflow_builder/connector';
import PlusSvg from '../../../assets/svg/worflow_builder/plus';
import { ReactComponent as Action } from '../../../assets/svg/worflow_builder/action.svg';
import { ReactComponent as Condition } from '../../../assets/svg/worflow_builder/conditon.svg';
import { ReactComponent as Notification } from '../../../assets/svg/worflow_builder/notification.svg';
import { ReactComponent as Pipeline } from '../../../assets/svg/worflow_builder/pipeline.svg';
import { Tooltip } from 'antd';
import MoveStepsModal from '../modalsV2/workflowBuilderModals/MoveStepsModal';
const WorkflowConnector = ({ alterData, index, style = {}, previousStepPath, previousStepId }) => {
	const [info, setInfo] = useState({
		connectorHeight: 64,
		buttonDisplay: false,
		fillOpacity: '0.32',
		addTypeModal: false,
	});

	const containerMouseHover = useCallback(() => {
		if (index === 0) {
			return;
		}
		setInfo((prev) => ({ ...prev, connectorHeight: 116, buttonDisplay: true }));
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

	const updatedButtonClick = useCallback((type, optionType, moveToPath = null) => {
		alterData({
			previousStepPath: previousStepPath,
			previousStepId: previousStepId,
			type,
			optionType,
			moveToPath,
		});
	}, []);

	return (
		<div
			className="workflowConnectorContainer"
			onMouseEnter={containerMouseHover}
			onMouseLeave={containerMouseLeave}
			style={{ ...style }}
		>
			{info?.buttonDisplay ? (
				<>
					<ConnectorSvg />
					<Tooltip
						// placement="bottomRight"
						title={
							<AddOptionsContainer
								updatedButtonClick={updatedButtonClick}
								closeToolTipFunc={() =>
									setInfo((prev) => ({ ...prev, addTypeModal: false }))
								}
							/>
						}
						color={'#202020'}
						arrow={false}
						trigger="click"
						overlayClassName="toolTipContainerForBuilder"
						open={info?.addTypeModal}
						onOpenChange={(open) => {
							setInfo((prev) => ({ ...prev, addTypeModal: open }));
						}}
					>
						<div
							className="plusBtnContainer"
							// onMouseEnter={() => plusBtnHover(true)}
							// onMouseLeave={() => plusBtnHover(false)}
							// onClick={updatedButtonClick}
						>
							<PlusSvg fillOpacity={info?.fillOpacity} />
						</div>
					</Tooltip>
					<ConnectorSvg />
				</>
			) : (
				<ConnectorSvg />
			)}
		</div>
	);
};

export default memo(WorkflowConnector);

const AddOptionsContainer = ({ updatedButtonClick, closeToolTipFunc }) => {
	const [info, setInfo] = useState({
		optionsData: [
			{
				title: 'Send Notification',
				subTitle: 'Send an Email as the next step',
				icons: <Notification />,
				type: 'action',
				optionType: 'notification',
			},
			// {
			// 	title: 'Action',
			// 	subTitle:
			// 		'Write tasks for yourself or your team members so nothing will never be missed throughout a project.',
			// 	icons: <Action />,
			// 	type: 'action',
			// 	optionType: 'action',
			// },
			{
				title: 'Condition',
				subTitle:
					'Enhance your client’s experience with high-converting, branded smart files.',
				icons: <Condition />,
				type: 'condition',
				optionType: 'condition',
			},

			// {
			// 	title: 'Move Pipeline stage',
			// 	subTitle:
			// 		'Automate your workflow by moving your project to a specific pipeline stage.',
			// 	icons: <Pipeline />,
			// 	type: 'action',
			// 	optionType: 'pipeline',
			// },
		],
		moveStepsModal: false,
	});

	const onCardClick = useCallback((elementData) => {
		if (elementData?.type === 'condition') {
			return setInfo((prev) => ({ ...prev, moveStepsModal: true }));
		}
		updatedButtonClick(elementData?.type, elementData?.optionType);
	}, []);

	const closeMoveStepsModal = useCallback(() => {
		closeToolTipFunc();
		setInfo((prev) => ({ ...prev, moveStepsModal: false }));
	}, [info?.moveStepsModal]);

	const updateStepsPath = useCallback((data) => {
		const type = 'condition';
		const optionType = 'condition';
		updatedButtonClick(type, optionType, data);
	}, []);

	return (
		<div className="addOptionsContainer">
			{info?.optionsData?.map((ele, index) => (
				<div className="optionsCards" key={index} onClick={() => onCardClick(ele)}>
					<div className="optionsTitle">
						{ele?.icons}
						{ele?.title}
					</div>
					<div className="optionsSubTitle">{ele?.subTitle}</div>
				</div>
			))}

			<MoveStepsModal
				modalIsOpen={info?.moveStepsModal}
				closeModal={closeMoveStepsModal}
				updateStepsPath={updateStepsPath}
			/>
		</div>
	);
};

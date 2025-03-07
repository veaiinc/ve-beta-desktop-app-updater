import React, { memo, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/scss/automations/automationCard.scss';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
import Context from '../../../../context/context';
import AutomationMenu from './AutomationMenu';
import AutomationSteps from './AutomationSteps';
import { message } from 'antd';
import Spinner from '../../loaders/Spinner';

const options = [
	{
		id: 1,
		title: 'Steps',
		value: 'steps',
	},
];

const AutomationCard = ({ automationId, automationTitle, automationStatus, automationSteps }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		showAutomationMenu: false,
		editAutomationTitle: false,
		automationTitle: automationTitle ?? '',
		isRenaming: false,
		activeOption: 'steps',
	});

	const {
		automationBuilder: { renameAutomationTitle },
	} = useContext(Context);

	const toggleAutomationMenu = () => {
		setInfo((prev) => ({
			...prev,
			showAutomationMenu: !info?.showAutomationMenu,
		}));
	};

	const handleSetAutomationTitle = (e) => {
		setInfo((prev) => ({
			...prev,
			automationTitle: e?.target?.value,
		}));
	};

	const handleRename = async (e) => {
		if (e?.key === 'Enter') {
			setInfo((prev) => ({
				...prev,
				isRenaming: true,
			}));
			const rename = info?.automationTitle?.trim();
			const response = await renameAutomationTitle(automationId, rename);
			if (response?.[0]) {
				message?.success('Automation renamed successfully!');
			} else {
				message?.error('Failed to rename automation!');
			}
			setInfo((prev) => ({
				...prev,
				isRenaming: false,
				editAutomationTitle: false,
			}));
		}
	};

	const enableAutomationTitleEditMode = () => {
		setInfo((prev) => ({
			...prev,
			editAutomationTitle: true,
		}));
	};

	const activeAutomationOptionMapper = useMemo(() => {
		return {
			steps: <AutomationSteps automationSteps={automationSteps} />,
		};
	}, [automationSteps]);

	return (
		<div className="automationCardContainer">
			<header className="automationHeader">
				<div className="automationTitleAndStatus">
					{info?.editAutomationTitle ? (
						<input
							className="renameAutomationTitle"
							type="text"
							value={info?.automationTitle}
							onChange={handleSetAutomationTitle}
							onKeyDown={handleRename}
							autoFocus
						/>
					) : (
						<h1 className="automationTitle">{info?.automationTitle}</h1>
					)}
					<h2 className="automationStatus">Status: {automationStatus}</h2>
				</div>
				{info?.isRenaming && <Spinner width="16px" height="16px" />}
				<AutomationMenu
					automationId={automationId}
					showAutomationMenu={info?.showAutomationMenu}
					toggleAutomationMenu={toggleAutomationMenu}
					enableAutomationTitleEditMode={enableAutomationTitleEditMode}
				>
					<ThreeDotsVerticalIcon />
				</AutomationMenu>
			</header>
			<ul className="automationOptions">
				{options?.map((option) => (
					<li key={option?.id} className="automationOption">
						<span
							className={`automationOptionTitle ${
								info?.activeOption === option?.value ? 'activeOption' : ''
							}`}
						>
							{option?.title}
						</span>
					</li>
				))}
			</ul>
			{activeAutomationOptionMapper?.[info?.activeOption]}
		</div>
	);
};

export default memo(AutomationCard);

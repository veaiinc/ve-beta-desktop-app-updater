import React, { memo, useContext, useState, useMemo } from 'react';
import '../../../../assets/scss/automations/automationCard.scss';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
import Context from '../../../../context/context';
import AutomationMenu from './AutomationMenu';
import AutomationSteps from './AutomationSteps';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import DeleteModal from '../../modalsV2/DeleteModal/DeleteModal';

const options = [
	{
		id: 1,
		title: 'Steps',
		value: 'steps',
	},
];

const AutomationCard = ({
	automationId,
	automationTitle,
	automationStatus,
	automationSteps,
	handleDeleteAutomation,
}) => {
	const [info, setInfo] = useState({
		showAutomationMenu: false,
		editAutomationTitle: false,
		automationTitle: automationTitle ?? '',
		isRenaming: false,
		activeOption: 'steps',
		deleteModal: { open: false },
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

	const handleOpenDeleteModal = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true },
		}));
	};

	const handleConfirmDelete = async () => {
		await handleDeleteAutomation(automationId);
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const activeAutomationOptionMapper = useMemo(() => {
		return {
			steps: <AutomationSteps automationSteps={automationSteps} />,
		};
	}, [automationSteps]);

	return (
		<>
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
							<>
								<h1 className="automationTitle">{info?.automationTitle}</h1>
							</>
						)}
					</div>
					{info?.isRenaming && <Spinner width="16px" height="16px" />}
					<AutomationMenu
						automationId={automationId}
						showAutomationMenu={info?.showAutomationMenu}
						toggleAutomationMenu={toggleAutomationMenu}
						enableAutomationTitleEditMode={enableAutomationTitleEditMode}
						handleDeleteAutomation={handleOpenDeleteModal}
					>
						<div className="automationStatusContainer">
							<h2 className="automationStatus">
								{automationStatus === 'published' && 'Live'}
							</h2>
							<ThreeDotsVerticalIcon />
						</div>
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

			{/* Delete Automation Modal */}
			<DeleteModal
				isOpen={info?.deleteModal?.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Automation?"
				itemType="automation"
				description="Are you sure you want to delete this automation?"
				warning="This automation will be permanently removed and cannot be recovered."
			/>
		</>
	);
};

export default memo(AutomationCard);

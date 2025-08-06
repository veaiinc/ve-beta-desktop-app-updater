import { memo, useContext, useEffect, useState } from 'react';
import { Drawer } from 'antd';
import s from './promptTab.module.scss';
import PromptInput from './PromptInput';
import Context from '../../../../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../../../../../components/globalComponents/CustomToast';
import KnowledgeAgentPrompt from '../../../../../knowledgeAgent/KnowledgeAgentPrompt';
import AgentCredentials from '../../../agentCredentials/AgentCredentials';
import { ReactComponent as SidebarClosingSvg } from '../../../../../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as Delete } from '../../tabs/assets/delete.svg';
import { ReactComponent as PlusIcon } from '../../tabs/assets/plus-icon.svg';
import Spinner from '../../../../../loaders/Spinner';
import DeleteFormModal from '../../../../../modalsV2/DeleteModal/DeleteModal';

const actionPattern = /<([^>]+)>/g;

const styles = {
	header: { display: 'none' },
	body: {
		padding: 0,
		height: '100vh',
		overflow: 'auto',
	},
};

const PromptTab = () => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: {
			activeKnowledgeAssistant,
			getActiveKnowledgeAgentDetails,
			getPipeDreamAction,
			getExistingconnectedAccounts,
			deleteConnectedAccount,
		},
		profileInfo: { userDetailsData, getUserDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		prompt: '',
		initialContent: '',
		actionDetails: [],
		drawerOpen: true,
		connectedAccounts: [],
		accountsLoading: false,
		deletingAccountId: null,
		deleteModal: { open: false, accountId: null, appName: null },
	});

	useEffect(() => {
		if (agentId) {
			getActiveKnowledgeAgentDetails(agentId);
		}
	}, [agentId]);

	useEffect(() => {
		if (!userDetailsData) {
			getUserDetails();
		}
	}, []);

	useEffect(() => {
		if (userDetailsData?._id) {
			fetchConnectedAccounts();
		}
	}, []);

	const tenatUserId = userDetailsData?._id;
	const agentData = activeKnowledgeAssistant?.data;

	const fetchConnectedAccounts = async () => {
		setInfo((prev) => ({ ...prev, accountsLoading: true }));
		try {
			const response = await getExistingconnectedAccounts({ tenatUserId });
			setInfo((prev) => ({
				...prev,
				connectedAccounts: response?.data?.connected_accounts || [],
			}));
		} catch (error) {
			console.error('Error fetching connected accounts:', error);
			setInfo((prev) => ({ ...prev, connectedAccounts: [] }));
		} finally {
			setInfo((prev) => ({ ...prev, accountsLoading: false }));
		}
	};

	// Handle delete account
	// const handleDeleteAccount = async (accountId, appName, e) => {
	// 	if (info?.deletingAccountId === accountId) return;
	// 	e.stopPropagation();
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		deletingAccountId: accountId,
	// 	}));

	// 	const response = await deleteConnectedAccount({
	// 		app: appName,
	// 		account_id: accountId,
	// 	});

	// 	if (response?.[0] === true) {
	// 		message.success('Account deleted successfully');
	// 		fetchConnectedAccounts();
	// 	} else {
	// 		message.error('Failed to delete account');
	// 	}

	// 	setInfo((prev) => ({
	// 		...prev,
	// 		deletingAccountId: null,
	// 	}));
	// };

	const handleOpenDeleteModal = (accountId, appName, e) => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true, accountId, appName },
		}));
	};

	const handleConfirmDelete = async () => {
		if (!info?.deleteModal?.accountId || !info?.deleteModal?.appName) return;

		setInfo((prev) => ({
			...prev,
			deletingAccountId: info.deleteModal.accountId,
		}));

		const response = await deleteConnectedAccount({
			app: info.deleteModal.appName,
			account_id: info.deleteModal.accountId,
		});

		if (response?.[0] === true) {
			message.success('Account deleted successfully');
			fetchConnectedAccounts();
		} else {
			message.error('Failed to delete account');
		}

		setInfo((prev) => ({
			...prev,
			deletingAccountId: null,
			deleteModal: { open: false, accountId: null, appName: null },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false, accountId: null, appName: null },
		}));
	};

	function getActionNamefromPrompt(prompt) {
		if (!prompt) return [];

		let actions = [];
		let match;

		while ((match = actionPattern.exec(prompt)) !== null) {
			actions.push(match[1]);
		}

		return actions;
	}

	useEffect(() => {
		const fetchPipeDreamAction = async () => {
			const actionNames = getActionNamefromPrompt(agentData?.prompt?.customEditedPrompt);
			const actionDetailsArray = [];

			for (const actionName of actionNames) {
				try {
					const response = await getPipeDreamAction(actionName);
					if (response?.[0] === true) {
						actionDetailsArray.push({
							actionName,
							actionData: response?.[1],
						});
					}
				} catch (error) {
					message.error(`Error fetching action ${actionName}:`, error);
				}
			}

			setInfo((prev) => ({ ...prev, actionDetails: actionDetailsArray }));
		};

		if (agentData?.prompt?.customEditedPrompt) {
			fetchPipeDreamAction();
		}
	}, [agentData?.prompt?.customEditedPrompt]);

	return (
		<div className={s.promptTabContainer}>
			<div className={s.leftContainer}>
				<div className={s.listContainer}>
					<div className={s.left}>
						<KnowledgeAgentPrompt
							assistant={agentData}
							actionDetails={info?.actionDetails}
						/>
					</div>
				</div>
			</div>

			<div className={s.rightContainer} style={{ width: info.drawerOpen ? `400px` : `0px` }}>
				<Drawer
					open={info.drawerOpen}
					placement="right"
					closable={false}
					mask={false}
					styles={styles}
					style={{ position: 'relative' }}
					className="promptTab__right promptTab__right--open"
					getContainer={false}
				>
					<div className={s.sidebarClosingSvg}>
						<SidebarClosingSvg
							onClick={() => setInfo((prev) => ({ ...prev, drawerOpen: false }))}
						/>
					</div>
					<div className="promptTab__drawer-content">
						<div className={s.drawerHeader}>
							<div className={s.drawerTitle}>
								<span>Tools</span>
							</div>
							{/* <button className={s.addToolButton}>
                <PlusIcon />
                <span>Add Tool</span>
              </button> */}
						</div>

						<div className={s.toolsContent}>
							{info.accountsLoading ? (
								<div className={s.loadingContainer}>
									<Spinner
										width="20px"
										height="20px"
										color="var(--primary-font)"
									/>
									<span>Loading tools...</span>
								</div>
							) : info.connectedAccounts.length === 0 ? (
								<div className={s.emptyState}>
									<p>No tools connected yet.</p>
									<p>Connect your first tool to get started.</p>
								</div>
							) : (
								<div className={s.toolsList}>
									{info.connectedAccounts.map((account) => (
										<div key={account.id} className={s.toolCard}>
											<div className={s.toolIcon}>
												<img
													src={account.app.img_src}
													alt={account.app.name}
													className={s.appIcon}
												/>
											</div>
											<div className={s.toolInfo}>
												<h3 className={s.toolTitle}>{account.app.name}</h3>
												<p className={s.toolDescription}>
													Connected on{' '}
													{new Date(
														account.created_at,
													).toLocaleDateString()}
												</p>
											</div>
											<button
												className={s.deleteButton}
												onClick={() =>
													handleOpenDeleteModal(
														account.id,
														account.app.name_slug,
													)
												}
												disabled={info.deletingAccountId === account.id}
											>
												{info.deletingAccountId === account.id ? (
													<Spinner
														width="16px"
														height="16px"
														color="var(--primary-font)"
													/>
												) : (
													<Delete />
												)}
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</Drawer>
				{!info.drawerOpen && (
					<div className={s.sidebarClosingSvg}>
						<SidebarClosingSvg
							onClick={() => setInfo((prev) => ({ ...prev, drawerOpen: true }))}
						/>
					</div>
				)}
			</div>

			{/* Delete Connected Account Modal */}
			<DeleteFormModal
				isOpen={info?.deleteModal?.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Disconnect Tool?"
				itemType="connected tool"
				description={`Are you sure you want to disconnect ${
					info?.deleteModal?.appName || 'this tool'
				}?`}
				warning="This tool will be disconnected and you'll need to reconnect it to use it again."
				confirmText="Disconnect"
			/>
		</div>
	);
};

export default memo(PromptTab);

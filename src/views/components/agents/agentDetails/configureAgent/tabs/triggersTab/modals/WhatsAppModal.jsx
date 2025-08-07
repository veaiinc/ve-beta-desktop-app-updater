import { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import s from './whatsAppModal.module.scss';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { ReactComponent as WhatsApp } from '../../../../../../../../assets/svg/ai_assistant/whatsappicon.svg';

import ReactModal from '../../../../../../../components/modalsV2/';
import Spinner from '../../../../../../../components/loaders/Spinner';
import Context from '../../../../../../../../context/context';
import { message } from '../../../../../../globalComponents/CustomToast';

const WhatsappAppSlugs = ['whatsapp_business', '_2chat', 'infobip'];

const WhatsAppModal = ({ isOpen, onClose, handleConnectToWhatsAppTrigger, isLoading }) => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: {
			getPipedreamTriggers,
			connectPipedreamTool,
			getExistingconnectedAccounts,
		},
		profileInfo: { userDetailsData, getUserDetails },
	} = useContext(Context);

	const [availableTriggers, setAvailableTriggers] = useState([]);
	const [selectedTrigger, setSelectedTrigger] = useState(null);
	const [loading, setLoading] = useState(false);
	const [connecting, setConnecting] = useState(false);
	const [fetchingAccounts, setFetchingAccounts] = useState(false);
	const [connectedAccounts, setConnectedAccounts] = useState([]);
	const [showTriggers, setShowTriggers] = useState(false);

	const tenantUserId = userDetailsData?._id;

	useEffect(() => {
		if (!userDetailsData) getUserDetails();
	}, [userDetailsData]);

	useEffect(() => {
		if (isOpen) fetchConnectedAccounts();
	}, [isOpen]);

	const isWhatsAppAccount = (account) => {
		const slug = account.app?.name_slug || account.app?.name;
		return WhatsappAppSlugs.includes(slug);
	};

	const fetchConnectedAccounts = async () => {
		if (!tenantUserId) return setShowTriggers(false);
		setFetchingAccounts(true);
		try {
			const res = await getExistingconnectedAccounts({ tenantUserId: tenantUserId });
			const accounts = res?.data?.connected_accounts || [];
			setConnectedAccounts(accounts);

			const hasWhatsApp = accounts.some(isWhatsAppAccount);
			setShowTriggers(hasWhatsApp);

			if (hasWhatsApp) fetchAvailableTriggers();
		} catch (err) {
			console.error('Error fetching accounts:', err);
			setShowTriggers(false);
		} finally {
			setFetchingAccounts(false);
		}
	};

	const fetchAvailableTriggers = async () => {
		setLoading(true);
		try {
			const [success, data] = await getPipedreamTriggers();
			if (!success) throw new Error('Failed to get triggers');

			const triggers = data?.triggers || (Array.isArray(data) ? data : []);
			setAvailableTriggers(triggers);
		} catch (err) {
			console.error(err);
			message.error('Failed to fetch available triggers');
		} finally {
			setLoading(false);
		}
	};

	const connectWhatsApp = async () => {
		setConnecting(true);
		try {
			const [success, res] = await connectPipedreamTool({ app: 'whatsapp_business' });
			if (!success || !res?.data?.token) {
				throw new Error(res?.message || 'Connection failed');
			}

			const pd = createFrontendClient();

			await new Promise((resolve, reject) => {
				pd.connectAccount({
					app: 'whatsapp_business',
					token: res.data.token,
					onSuccess: async () => {
						// await new Promise((r) => setTimeout(r, 2000));
						try {
							const accRes = await getExistingconnectedAccounts({
								tenatUserId: tenantUserId,
							});
							const updatedAccounts = accRes?.data?.connected_accounts || [];
							const newWhatsApp = updatedAccounts.find(isWhatsAppAccount);

							if (newWhatsApp) {
								setConnectedAccounts((prev) => [...prev, newWhatsApp]);
								setShowTriggers(true);
								await fetchAvailableTriggers();
								message.success('WhatsApp connected successfully!');
							} else {
								throw new Error('No WhatsApp account found after connection.');
							}
							resolve();
						} catch (err) {
							console.error('onSuccess error:', err);
							reject(err);
						}
					},
					onError: (err) => {
						console.error('SDK error:', err);
						message.error(err.message || 'Connection failed');
						reject(err);
					},
				});
			});
		} catch (err) {
			console.error(err);
			message.error(err.message || 'Failed to connect WhatsApp');
		} finally {
			setConnecting(false);
		}
	};

	const handleTriggerSelection = (trigger) => setSelectedTrigger(trigger);

	const handleConnect = async () => {
		if (!selectedTrigger) {
			return message.error('Please select a trigger');
		}

		setConnecting(true);
		try {
			const whatsappAccount = connectedAccounts.find(isWhatsAppAccount);
			if (!whatsappAccount) throw new Error('No WhatsApp account connected');

			const triggerData = {
				title: selectedTrigger.name,
				description: selectedTrigger.description,
				assistantId: agentId,
				triggerType: 'app',
				app: 'whatsapp',
				platform: 'pipedream',
			};

			const config = {
				trigger_config: {
					id: selectedTrigger.key,
					props: {
						whatsapp: whatsappAccount.id,
						httpInterface: { customResponse: true },
					},
					webhook_url: `https://us.api.ve.ai/third-party-integrations/1.0/${tenantUserId}/${agentId}`,
				},
			};

			await handleConnectToWhatsAppTrigger(triggerData, config);
			message.success('Trigger connected!');
			onClose();
		} catch (err) {
			console.error('Connect error:', err);
			message.error(err.message || 'Failed to connect trigger');
		} finally {
			setConnecting(false);
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType="center"
			customStyles={{
				content: { zIndex: 1000 },
				overlay: { zIndex: 1001 },
			}}
		>
			<div className={s.whatsAppModalContainer}>
				<header>
					<h1>Connect WhatsApp Trigger</h1>
					<p>
						{showTriggers
							? 'Select a WhatsApp trigger to connect to your agent'
							: 'First, connect your WhatsApp account to get started'}
					</p>
				</header>

				<div className={s.divider} />

				{fetchingAccounts ? (
					<div className={s.content}>
						<div className={s.loadingContainer}>
							<Spinner
								width="32px"
								height="32px"
								color="var(--whatsapp-green)"
								borderTopColor="transparent"
								borderWidth={3}
							/>
							<p>Checking your connected accounts...</p>
						</div>
					</div>
				) : !showTriggers ? (
					<div className={s.content}>
						<div className={s.connectStep}>
							<div className={s.connectIcon}>
								<WhatsApp />
							</div>
							<h3>Connect WhatsApp Account</h3>
							<p>Connect your WhatsApp Business account before creating triggers.</p>
							<button
								className={s.connectWhatsAppButton}
								onClick={connectWhatsApp}
								disabled={connecting}
							>
								{connecting ? (
									<>
										<Spinner
											width="16px"
											height="16px"
											color="white"
											borderTopColor="transparent"
											borderWidth={2}
											cssstyle={{ marginRight: '8px' }}
										/>
										Connecting...
									</>
								) : (
									'Connect WhatsApp'
								)}
							</button>
						</div>
					</div>
				) : loading ? (
					<div className={s.content}>
						<div className={s.triggerList}>
							<h3>Available Triggers</h3>
							<div className={s.skeletonContainer}>
								{[1, 2, 3].map((i) => (
									<div key={i} className={s.skeletonItem}>
										<div className={s.skeletonIcon} />
										<div className={s.skeletonContent}>
											<div className={s.skeletonTitle} />
											<div className={s.skeletonDescription} />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className={s.content}>
						<div className={s.triggerList}>
							<h3>Available Triggers</h3>
							{availableTriggers.length === 0 ? (
								<p className={s.noTriggers}>No WhatsApp triggers available</p>
							) : (
								<ul>
									{availableTriggers.map((trigger) => (
										<li
											key={trigger.key}
											className={`${s.triggerItem} ${
												selectedTrigger?.key === trigger.key
													? s.selected
													: ''
											}`}
											onClick={() => handleTriggerSelection(trigger)}
										>
											<div className={s.triggerIcon}>
												<WhatsApp />
											</div>
											<div className={s.triggerInfo}>
												<h4>{trigger.name}</h4>
												<p>{trigger.description}</p>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}

				{showTriggers && (
					<div className={s.footer}>
						<button
							className={s.cancelButton}
							onClick={onClose}
							disabled={isLoading || connecting}
						>
							Cancel
						</button>
						<button
							className={s.connectButton}
							onClick={handleConnect}
							disabled={!selectedTrigger || isLoading || connecting}
						>
							{isLoading || connecting ? (
								<>
									<Spinner
										width="14px"
										height="14px"
										color="var(--primary-font)"
										borderTopColor="transparent"
										borderWidth={2}
										cssstyle={{ marginRight: '6px' }}
									/>
									Connecting...
								</>
							) : (
								'Connect Trigger'
							)}
						</button>
					</div>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(WhatsAppModal);

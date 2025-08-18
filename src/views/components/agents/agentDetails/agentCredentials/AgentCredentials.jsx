import {
	memo,
	useState,
	useEffect,
	useContext,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react';
import s from './agentCredentials.module.scss';
import Context from '../../../../../context/context';
import { message } from '../../../../components/globalComponents/CustomToast';
import PencilIcon from '../assets/PencilIcon';
import { ReactComponent as Botsvg } from '../assets/botSvg.svg';

const AgentCredentials = forwardRef(({ agentId, agentForRunAgent = false, myAccess }, ref) => {
	const agentNameInputRef = useRef(null);

	const {
		knowledgeAgent: { activeKnowledgeAssistant, updateKnowledgeAgent, uploadAgentProfilePic },
	} = useContext(Context);

	const [info, setInfo] = useState({
		agentName: '',
		agentDescription: '',
		agentProfilePic: null,
		editAgentDetails: {
			agentName: false,
			agentDescription: false,
		},
	});
	useImperativeHandle(ref, () => ({
		triggerEditAgentName() {
			setInfo((prev) => ({
				...prev,
				editAgentDetails: {
					...prev.editAgentDetails,
					agentName: true,
				},
			}));
			setTimeout(() => {
				if (agentNameInputRef.current) {
					agentNameInputRef.current.focus();
				}
			}, 0);
		},
	}));

	useEffect(() => {
		const name = activeKnowledgeAssistant?.data?.name ?? '';
		const description = activeKnowledgeAssistant?.data?.description ?? '';
		const profilePic =
			activeKnowledgeAssistant?.data?.knowledgeAgent_profile_picture_s3Key ?? null;

		setInfo((prev) => ({
			...prev,
			agentName: name,
			agentDescription: description,
			agentProfilePic: profilePic,
		}));
	}, [activeKnowledgeAssistant]);

	const handleUploadAgentProfilePic = async (e) => {
		try {
			const agentProfilePic = e.target.files[0];
			if (!agentProfilePic) return;

			const [success, error] = await uploadAgentProfilePic({
				agentId,
				file: agentProfilePic,
			});

			if (success) {
				message.success('Profile picture uploaded successfully');
				setInfo((prev) => ({
					...prev,
					agentProfilePic: URL.createObjectURL(agentProfilePic),
				}));
			} else {
				message.error(error?.message || 'Failed to upload profile picture');
			}
		} catch (err) {
			message.error(
				err?.message || 'An unexpected error occurred while uploading the profile picture',
			);
		}
	};

	const handleAgentUpdate = (type) => {
		const currentValue = info[type];
		if (currentValue === activeKnowledgeAssistant?.data?.name && type === 'agentName') return;
		if (
			currentValue === activeKnowledgeAssistant?.data?.description &&
			type === 'agentDescription'
		)
			return;

		if (!currentValue.trim()) {
			message.error(`${type === 'agentName' ? 'Name' : 'Description'} cannot be empty!`);
			setInfo((prev) => ({
				...prev,
				[type]: activeKnowledgeAssistant?.data?.[
					type === 'agentName' ? 'name' : 'description'
				],
				editAgentDetails: {
					...prev.editAgentDetails,
					[type]: false,
				},
			}));
			return;
		}

		updateKnowledgeAgent(agentId, {
			...(type === 'agentName' && { name: currentValue }),
			...(type === 'agentDescription' && { description: currentValue }),
		});

		setInfo((prev) => ({
			...prev,
			editAgentDetails: {
				...prev.editAgentDetails,
				[type]: false,
			},
		}));
	};

	const toggleEditAgentDetails = (type) => {
		if (myAccess === 'view') return;
		setInfo((prev) => ({
			...prev,
			editAgentDetails: {
				...prev.editAgentDetails,
				[type]: !prev.editAgentDetails[type],
			},
		}));
		if (type === 'agentName' && !info.editAgentDetails.agentName && agentNameInputRef.current) {
			setTimeout(() => {
				agentNameInputRef.current.focus();
			}, 0);
		}
	};

	return (
		<div className={`${s.agentCredentialsContainer} ${agentForRunAgent ? s.runAgent : ''}`}>
			<div className={s.agentProfilePicContainer}>
				{info.agentProfilePic ? (
					<img src={info.agentProfilePic} alt="agent icon" className={s.agentIcon} />
				) : (
					<div className={`${s.agentIcon} ${s.border}`}>
						<Botsvg />
					</div>
				)}

				<input
					type="file"
					onChange={myAccess !== 'view' ? handleUploadAgentProfilePic : undefined}
					accept="image/png,image/jpeg,image/jpg"
					disabled={myAccess === 'view'}
				/>
			</div>

			<div className={s.agentDetails}>
				<div className={s.agentName}>
					{info.editAgentDetails.agentName ? (
						<input
							type="text"
							value={info.agentName}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, agentName: e.target.value }))
							}
							readOnly={myAccess === 'view'}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleAgentUpdate('agentName');
								}
							}}
							onBlur={() => {
								toggleEditAgentDetails('agentName');
								handleAgentUpdate('agentName');
							}}
							aria-label="Edit agent name"
							className={s.input}
							placeholder="Give a name to your agent and hit enter!"
							ref={agentNameInputRef}
						/>
					) : (
						<>
							<span
								onClick={() => toggleEditAgentDetails('agentName')}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										toggleEditAgentDetails('agentName');
									}
								}}
								style={{
									justifyContent: agentForRunAgent ? 'center' : 'flex-start',
								}}
							>
								{info.agentName || activeKnowledgeAssistant?.data?.name}
							</span>
							{myAccess !== 'view' && <PencilIcon />}
						</>
					)}
				</div>

				<div className={s.agentDescription}>
					{info.editAgentDetails.agentDescription ? (
						<textarea
							placeholder="Give a description to your agent and hit enter!"
							autoFocus
							value={info.agentDescription}
							onChange={(e) =>
								setInfo((prev) => ({
									...prev,
									agentDescription: e.target.value,
								}))
							}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleAgentUpdate('agentDescription');
								}
							}}
							onBlur={() => {
								toggleEditAgentDetails('agentDescription');
								handleAgentUpdate('agentDescription');
							}}
							aria-label="Edit agent description"
							className={s.textarea}
							rows={3}
							readOnly={myAccess === 'view'}
						/>
					) : (
						<>
							<p
								onClick={() => toggleEditAgentDetails('agentDescription')}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										toggleEditAgentDetails('agentDescription');
									}
								}}
								style={{ textAlign: agentForRunAgent ? 'center' : 'left' }}
							>
								{info.agentDescription ||
									activeKnowledgeAssistant?.data?.description}
							</p>
							{myAccess !== 'view' && <PencilIcon />}
						</>
					)}
				</div>
			</div>
		</div>
	);
});

AgentCredentials.displayName = 'AgentCredentials';

export default memo(AgentCredentials);

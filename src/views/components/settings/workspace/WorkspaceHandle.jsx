import React, { useState, useContext, useCallback, useEffect, memo } from 'react';
import { ReactComponent as ActivePoint } from '../../../../assets/svg/Settings/GreenpinActive.svg';
import UpdateWorkspacePopup from './UpdateWorkspacePopup';
import Context from '../../../../context/context';
import { message } from 'antd';

const IsActiveComponent = () => {
	return (
		<div className="activeDomainDiv">
			<ActivePoint />
			<p>Active</p>
		</div>
	);
};

const WorkspaceHandleComponent = ({ overviewState }) => {
	// Contexts
	const {
		profileInfo: { updateWorkSpaceId, tennantSettingsData, getTenantSettings },
		companyInfo: { checkWorkspaceId },
	} = useContext(Context);

	const [messageApi, contextHolder] = message.useMessage();

	// useStates
	const [domainUpdate, setdomainUpdate] = useState({
		isValueChanged: false,
		isDomainPresent: false,
		message: '',
		isPopupOpen: false,
		isActive: true,
		timeout: null,
		isWorkspaceFull: false,
		activeWorkspace: '',
	});
	const [domainInput, setdomainInput] = useState('');

	// useEffects
	useEffect(() => {
		const doamins = tennantSettingsData?.workspaceIds
			? [...tennantSettingsData?.workspaceIds]
			: [];

		if (doamins?.length > 0) {
			let currentWorkspace =
				tennantSettingsData?.workspaceIds[tennantSettingsData?.workspaceIds?.length - 1];
			setdomainInput(currentWorkspace);

			setdomainUpdate((prev) => ({ ...prev, activeWorkspace: currentWorkspace }));

			if (doamins.length === 3) {
				setdomainUpdate((prev) => ({ ...prev, isWorkspaceFull: true }));
			}
		}
	}, [tennantSettingsData?.workspaceIds]);

	// Functions
	const workspaceChangeHandler = async (e) => {
		const updatedValue = e?.target?.value?.toLowerCase();
		setdomainInput(updatedValue);
		if (updatedValue?.length <= 3) {
			return setdomainUpdate((prev) => ({
				...prev,
				isValueChanged: true,
				message: 'Domain name should be at least 4',
				isPopupOpen: false,
				isDomainPresent: false,
				isActive: false,
			}));
		} else if (domainUpdate?.activeWorkspace === updatedValue) {
			return setdomainUpdate((prev) => ({
				...prev,
				isValueChanged: true,
				isActive: false,
				message: 'Domain name should not be equal to active domain',
				isDomainPresent: false,
			}));
		} else if (!domainUpdate?.isValueChanged) {
			setdomainUpdate((prev) => ({ ...prev, isValueChanged: true, isActive: false }));
		}

		handleDebounceSearch(updatedValue);
	};

	const handleDebounceSearch = useCallback(
		(domainname) => {
			clearInterval(domainUpdate?.timeout);
			const timeout = setTimeout(() => {
				checkDomainNameFunc(domainname);
			}, 800);
			setdomainUpdate((prev) => ({ ...prev, timeout }));
		},
		[domainUpdate?.timeout],
	);

	const checkDomainNameFunc = async (domainname) => {
		setdomainUpdate((prev) => ({ ...prev, timeout: null }));
		const respone = await checkWorkspaceId(domainname);

		setdomainUpdate((prev) => {
			const update = { ...prev };
			if (respone?.[1]?.isAvailable) {
				update.isDomainPresent = true;
				update.message = 'Available';
			} else {
				update.isDomainPresent = false;
				update.message = 'Domain name has already been taken.';
			}
			return update;
		});
	};

	const updateDomainFunction = async () => {
		const json = {
			workspaceId: domainInput,
		};

		const response = await updateWorkSpaceId(json);

		if (response[0] === true) {
			messageApi.open({
				type: 'success',
				content: 'Successfully updated the workspace handle',
			});
			getTenantSettings();
		} else {
			messageApi.open({
				type: 'error',
				content: response[1]?.message || 'something went wrong',
			});
		}
		setdomainUpdate((prev) => ({
			...prev,
			isValueChanged: false,
			isDomainPresent: false,
			message: '',
			isPopupOpen: false,
			isActive: true,
		}));
		setdomainInput(domainUpdate?.activeWorkspace);
	};

	return (
		<>
			{contextHolder}

			<div>
				<div>
					<h1>Your Workspace Handle</h1>
				</div>

				<div className="domainContainer">
					<h2>Sub Domain Name</h2>

					<div className="domainInput">
						<div
							className="inputDiv"
							style={{
								border: domainUpdate?.isValueChanged
									? domainUpdate?.message === ''
										? ''
										: domainUpdate?.isDomainPresent
										? '1px dashed rgba(9, 169, 53, 0.16)'
										: '1px solid rgba(255, 64, 64, 0.16)'
									: '',
							}}
						>
							<input
								placeholder="minimun 4 letters"
								value={domainInput}
								onChange={workspaceChangeHandler}
								disabled={domainUpdate?.isWorkspaceFull ? true : false}
							/>
							<p className="domainName">ve.ai</p>
						</div>
						{!domainUpdate?.isWorkspaceFull && domainUpdate?.isDomainPresent && (
							<button
								className="checkButton"
								onClick={() => {
									if (domainUpdate?.isDomainPresent) {
										setdomainUpdate((prev) => ({ ...prev, isPopupOpen: true }));
									}
								}}
							>
								Update
							</button>
						)}

						{domainUpdate?.isActive && <IsActiveComponent />}
					</div>

					{domainUpdate?.isValueChanged && domainUpdate?.message && (
						<p
							className="messsageShow"
							style={{
								color: domainUpdate?.isDomainPresent
									? 'rgba(9, 169, 53, 0.48)'
									: 'rgba(255, 64, 64, 0.48)',
							}}
						>
							{domainUpdate?.message}
						</p>
					)}

					{domainUpdate?.isWorkspaceFull && (
						<p className="messsageShow" style={{ color: 'gray' }}>
							You have reached maximum limit of sub-domains
						</p>
					)}
				</div>

				{domainUpdate?.isDomainPresent && domainInput !== overviewState?.workspaceId && (
					<UpdateWorkspacePopup
						oldWorkspaceId={overviewState?.workspaceId}
						newWorkspaceId={domainInput}
						domainUpdate={domainUpdate}
						setdomainUpdate={setdomainUpdate}
						updateDomainFunction={updateDomainFunction}
						remainingCount={3 - overviewState?.tennatWorkspaceIds?.length || 2}
					/>
				)}
			</div>
		</>
	);
};

export default memo(WorkspaceHandleComponent);

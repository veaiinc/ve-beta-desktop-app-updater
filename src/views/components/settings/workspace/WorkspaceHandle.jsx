import React, { useState, useContext } from 'react';
import { ReactComponent as ActivePoint } from '../../../../assets/svg/Settings/GreenpinActive.svg';
import UpdateWorkspacePopup from './UpdateWorkspacePopup';
import Context from '../../../../context/context';

const IsActiveComponent = () => {
	return (
		<div className="activeDomainDiv">
			<ActivePoint />
			<p>Active</p>
		</div>
	);
};

const WorkspaceHandleComponent = ({ overviewState }) => {
	const {
		profileInfo: { updateWorkSpaceId },
	} = useContext(Context);

	const [domainUpdate, setdomainUpdate] = useState({
		isValueChanged: false,
		isDomainPresent: false,
		message: '',
		isPopupOpen: false,
	});
	const [domainInput, setdomainInput] = useState(
		overviewState?.tennatWorkspaceIds[overviewState?.tennatWorkspaceIds.length - 1] || '',
	);

	const workspaceChangeHandler = (e) => {
		if (!domainUpdate?.isValueChanged)
			setdomainUpdate((prev) => ({ ...prev, isValueChanged: true, isPopupOpen: false }));
		setdomainInput(e.target.value);
	};

	const updateDomainFunction = () => {
		const json = {
			workspaceId: domainInput,
		};

		// {"updatesRemaining":1}
		updateWorkSpaceId(json);
	};

	return (
		<div>
			<div>
				<h1>Your workspace handle</h1>
			</div>

			<div className="domainContainer">
				<h2>Domain Name</h2>

				<div className="domainInput">
					<div
						className="inputDiv"
						style={{
							border: !domainUpdate?.isValueChanged
								? ''
								: domainUpdate?.isDomainPresent
								? '1px dashed rgba(9, 169, 53, 0.16)'
								: '1px solid rgba(255, 64, 64, 0.16)',
						}}
					>
						<input
							placeholder="minimun 4 letters"
							value={domainInput}
							onChange={workspaceChangeHandler}
						/>
						<p className="domainName">ve.ai</p>
					</div>
					{domainUpdate?.isDomainPresent && (
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

					{!domainUpdate.isValueChanged && <IsActiveComponent />}
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
			</div>

			{domainUpdate?.isDomainPresent && domainInput !== overviewState?.workspaceId && (
				<UpdateWorkspacePopup
					oldWorkspaceId={overviewState?.workspaceId}
					newWorkspaceId={domainInput}
					domainUpdate={domainUpdate}
					setdomainUpdate={setdomainUpdate}
					updateDomainFunction={updateDomainFunction}
					remainingCount={overviewState?.tennatWorkspaceIds?.length || 2}
				/>
			)}
		</div>
	);
};

export default WorkspaceHandleComponent;

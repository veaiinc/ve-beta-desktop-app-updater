import React, { memo, useState } from 'react';
import ReactModal from '../../modalsV2';
import { ReactComponent as FinalInfoSvg } from '../../../../assets/svg/Settings/exlametryCircle.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';

const UpdateWorkspacePopup = ({
	oldWorkspaceId,
	newWorkspaceId,
	domainUpdate,
	setdomainUpdate,
	updateDomainFunction,
}) => {
	const closeModalFunc = () => {
		setdomainUpdate((prev) => ({ ...prev, isPopupOpen: false }));
	};
	return (
		<div>
			<ReactModal isOpen={domainUpdate?.isPopupOpen} closeModal={closeModalFunc}>
				<div className="UpdateWorkspacePopup">
					<div className="headerPopup">
						<h1>Update ve.ai Domain?</h1>
						<span onClick={closeModalFunc}>
							<CloseSvg />
						</span>
					</div>

					<div className="finalviewInputDiv">
						<h5>Old</h5>
						<input type="text" disabled={true} value={`${oldWorkspaceId}.ve.ai`} />
					</div>

					<div className="finalviewInputDiv">
						<h5>New</h5>
						<input type="text" disabled={true} value={`${newWorkspaceId}.ve.ai`} />
					</div>

					<div className="finalWarningDiv">
						<FinalInfoSvg />
						<p>You would have 2 domain changes left after this change</p>
					</div>

					<button className="updateFinalWorkspaceButton" onClick={updateDomainFunction}>
						Update
					</button>
				</div>
			</ReactModal>
		</div>
	);
};

export default memo(UpdateWorkspacePopup);

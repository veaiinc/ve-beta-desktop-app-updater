import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import { useLocation } from 'react-router-dom';
import Context from '../../../../context/context';
import SendProposalModal from '../../../components/modalsV2/proposalModals/SendProposalModal';
import CopiedModal from '../../../components/modalsV2/workflowsModals/CopiedModal';
const SmartFile = () => {
	const location = useLocation();

	let {
		templates: { getSmartFileData, smartFileInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'form', //form,file
		incomingData: location?.state?.data,
		workflowId: location?.state?.workflowId,
		sendSmartFileModal: false,
		workflowData: location?.state?.workflow,
		copyModal: false,
	});

	//useEffect
	useEffect(() => {
		getSmartFileInfo();
	}, []);

	//function defination

	const getSmartFileInfo = useCallback(async () => {
		const payload = {
			getWorkflowWithModulesId: info?.workflowId,
		};
		getSmartFileData(payload);
	}, [info?.workflowId]);

	const chnageActiveTab = useCallback(
		(data) => {
			if (data === info?.activeTab) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeTab: data }));
		},
		[info?.activeTab],
	);

	const openSendSmartFileModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, [info?.sendSmartFileModal]);

	const openCopyModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	}, [info?.sendSmartFileModal]);

	return (
		<div className="smartFileParentContainer">
			<SmartFileHeader
				activeTab={info?.activeTab}
				chnageActiveTab={chnageActiveTab}
				openSendSmartFileModal={openSendSmartFileModal}
			/>
			<div className="mainContentContainer">
				{info?.activeTab === 'form' ? (
					<FormResponses />
				) : (
					<File templateData={info?.incomingData} />
				)}
			</div>

			<SendProposalModal
				open={info?.sendSmartFileModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendSmartFileModal: false }))}
				clientDetails={info?.workflowData?.clientDetails}
				workflowSlug={info?.workflowData?.slug}
				workflowId={info?.workflowId}
				openCopyModal={openCopyModal}
			/>
			<CopiedModal
				open={info?.copyModal}
				closeModal={() => setInfo((prev) => ({ ...prev, copyModal: false }))}
				modules={info?.workflowData?.modules}
				copyLink={`https://${localStorage.getItem('workspaceId')}.ve.co/portal/${
					info?.workflowData?.slug
				}`}
			/>
		</div>
	);
};

export default memo(SmartFile);

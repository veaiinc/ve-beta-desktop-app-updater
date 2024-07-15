import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/proposals.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import ServicesBlock from '../../components/proposalComponents/ServicesBlock';
import VariablesBlock from '../../components/proposalComponents/VariablesBlock';
import ProposalExpiry from '../../components/proposalComponents/ProposalExpiry';
import PaymentSchedule from '../../components/proposalComponents/PaymentSchedule';
import EventsBlock from '../../components/proposalComponents/EventsBlock';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InvoiceBlock from '../../components/proposalComponents/InvoiceBlock';
import FileVariablesBlock from '../../components/proposalComponents/FileVariablesBlock';
import ClientVariablesBlock from '../../components/proposalComponents/ClientVariablesBlock';
import SendProposalModal from '../../components/modalsV2/proposalModals/SendProposalModal';

function ProposalCRUD(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const { proposalId } = useParams();
	const {
		proposals: {
			proposalInfo,
			getAllProposalContentInfo,
			updateProposalContent,
			updateProposal,
			sendProposal,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		proposalData: null,
		sendProposalModal: false,
		dataChanged: false,
		saveLoader: false,
		workflowId: location?.state?.workflowId,
	});

	useEffect(() => {
		getPropsalData();
		return () => {
			updateProposalContent(null);
		};
	}, []);

	useEffect(() => {
		if (proposalInfo) {
			setInfo((prev) => ({ ...prev, proposalData: proposalInfo }));
		}
	}, [proposalInfo]);

	//functions definations
	const getPropsalData = useCallback(async () => {
		const payload = { id: proposalId, workflowId: info?.workflowId };
		getAllProposalContentInfo(payload);
	}, [proposalId, info?.workflowId]);

	//tableData changes
	const handleTableDataChange = useCallback(
		async (newData, tableDataIndex) => {
			const updatedTableData = [...(info?.proposalData?.tables || [])];
			updatedTableData?.splice(tableDataIndex, 1, newData);
			setInfo((prev) => ({
				...prev,
				proposalData: { ...prev?.proposalData, tables: updatedTableData },
				dataChanged: true,
			}));
		},
		[info?.proposalData],
	);

	//variable Data changes
	const handleVariableDataChange = useCallback(
		async (newData) => {
			const updatedVariables = [...(info?.proposalData?.variables || [])];
			let index;
			for (let i = 0; i < updatedVariables?.length; i++) {
				if (updatedVariables?.[i]?._id === newData?._id) {
					index = i;
					break;
				}
			}
			updatedVariables?.splice(index, 1, newData);
			setInfo((prev) => ({
				...prev,
				proposalData: { ...prev?.proposalData, variables: updatedVariables },
				dataChanged: true,
			}));
		},
		[info?.proposalData],
	);
	//expiryInDays Changes
	const handleExpiryInDaysChange = useCallback(async (newData) => {
		setInfo((prev) => ({
			...prev,
			proposalData: { ...prev?.proposalData, expiryInDays: +newData },
			dataChanged: true,
		}));
	}, []);

	//saveProposal

	const saveProposalData = useCallback(async () => {
		if (info?.saveLoader) {
			return;
		}
		if (!info?.dataChanged) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));
		const {
			variables,
			tables,
			paymentSchedule,
			paymentDetails,
			financeSummary,
			expiryInDays,
			deliverables,
			conditionals,
		} = info?.proposalData || {};
		const paylaod = {
			proposalId: proposalId,
			proposalInput: {
				versions: {
					variables,
					tables,
					paymentSchedule,
					paymentDetails,
					financeSummary,
					expiryInDays,
					deliverables,
					conditionals,
				},
			},
			versionId: info?.proposalData?.activeVersion,
		};
		const response = await updateProposal(paylaod);
		if (response?.[0]) {
			getPropsalData();
		}
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, [info?.proposalData, info?.dataChanged, info?.saveLoader]);

	const sendProposalFunc = useCallback(async () => {
		const payload = {
			clientEmail: info?.proposalData?.clientDetails?.email,
			workflowId: info?.proposalData?.workflowId,
		};
		const response = await sendProposal(payload);
		if (response?.[0]) {
		} else {
		}
	}, [info?.proposalData?.clientDetails, info?.proposalData?.workflowId]);

	return (
		<div className="proposalsContainer">
			<div className="header">
				<div
					className="titleAndBackButton"
					style={{ cursor: 'pointer' }}
					onClick={() => navigate(-1)}
				>
					<LeftArrow />{' '}
					<p>{`create new File for ${info?.proposalData?.clientDetails?.name || ''}`}</p>
				</div>
				{info?.dataChanged ? (
					<div
						className="sendProposalButton"
						style={{ backgroundColor: '#6055EC' }}
						onClick={saveProposalData}
					>
						<p>{info?.saveLoader ? 'Saving...' : 'Save'}</p>
					</div>
				) : (
					<div
						className="sendProposalButton"
						onClick={() => setInfo((prev) => ({ ...prev, sendProposalModal: true }))}
					>
						<p>Send Proposal</p>
					</div>
				)}
			</div>
			<div className="propsosEditContainer">
				<div className="previewContainer">
					<FileVariablesBlock
						variablesData={info?.proposalData?.variables}
						onVariableDatChnage={handleVariableDataChange}
					/>
					<ClientVariablesBlock
						variablesData={info?.proposalData?.variables}
						onVariableDatChnage={handleVariableDataChange}
					/>
					<ProposalExpiry
						expiryData={info?.proposalData?.expiryInDays}
						onChangeFunc={(data) => handleExpiryInDaysChange(data)}
					/>
					{/* <InvoiceBlock /> */}
				</div>

				<div className="editContainer">
					{info?.proposalData?.tables
						?.filter((ele) => ele?.type === 'services')
						?.map((item, index) => (
							<ServicesBlock
								serviceData={item || {}}
								selectedIndex={index}
								onChangeFunc={handleTableDataChange}
								key={index}
							/>
						))}

					{info?.proposalData?.tables
						?.filter((item) => item?.type === 'events')
						?.map((ele, index) => (
							<EventsBlock
								eventData={ele || {}}
								selectedIndex={index}
								onChangeFunc={handleTableDataChange}
								key={index}
							/>
						))}

					{/* <PaymentSchedule /> */}
				</div>
			</div>

			<SendProposalModal
				open={info?.sendProposalModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendProposalModal: false }))}
				sendProposal={sendProposalFunc}
				clientDetails={info?.proposalData?.clientDetails}
				workflowSlug={info?.proposalData?.workflow?.slug}
			/>
		</div>
	);
}

export default ProposalCRUD;

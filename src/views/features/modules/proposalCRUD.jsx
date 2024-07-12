import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/proposals.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import ServicesBlock from '../../components/proposalComponents/ServicesBlock';
import VariablesBlock from '../../components/proposalComponents/VariablesBlock';
import ProposalExpiry from '../../components/proposalComponents/ProposalExpiry';
import PaymentSchedule from '../../components/proposalComponents/PaymentSchedule';
import EventsBlock from '../../components/proposalComponents/EventsBlock';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InvoiceBlock from '../../components/proposalComponents/InvoiceBlock';
import FileVariablesBlock from '../../components/proposalComponents/FileVariablesBlock';
import ClientVariablesBlock from '../../components/proposalComponents/ClientVariablesBlock';
import SendProposalModal from '../../components/modalsV2/proposalModals/SendProposalModal';

function ProposalCRUD(props) {
	// const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { proposalId } = useParams();
	// const versionId = Object.fromEntries(searchParams)?.verison;
	const {
		proposals: {
			proposalInfo,
			getAllProposalContentInfo,
			updateProposalContent,
			updateProposal,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		proposalData: null,
		sendProposalModal: false,
		dataChanged: false,
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
		const payload = { id: proposalId };
		getAllProposalContentInfo(payload);
	}, [proposalId]);

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
		async (newData, index) => {
			const updatedVariables = [...(info?.proposalData?.variables || [])];
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
		if (!info?.dataChanged) {
			return;
		}
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
	}, [info?.proposalData, info?.dataChanged]);

	return (
		<div className="proposalsContainer">
			<div className="header">
				<div
					className="titleAndBackButton"
					style={{ cursor: 'pointer' }}
					onClick={() => navigate(-1)}
				>
					<LeftArrow /> <p>create new File for *client name here*</p>
				</div>
				{info?.dataChanged ? (
					<div
						className="sendProposalButton"
						style={{ backgroundColor: '#6055EC' }}
						onClick={saveProposalData}
					>
						<p>Save</p>
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
					<ClientVariablesBlock />
					<ProposalExpiry
						expiryData={info?.proposalData?.expiryInDays}
						onChangeFunc={(data) => handleExpiryInDaysChange(data)}
					/>
					<InvoiceBlock />
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

					<PaymentSchedule />
				</div>
			</div>
			<SendProposalModal
				open={info?.sendProposalModal}
				closeModal={() => setInfo((prev) => ({ ...prev, sendProposalModal: false }))}
			/>
		</div>
	);
}

export default ProposalCRUD;

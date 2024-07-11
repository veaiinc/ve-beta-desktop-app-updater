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
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { proposalId } = useParams();
	const versionId = Object.fromEntries(searchParams)?.verison;
	const {
		proposals: { proposalInfo, updateProposalContent },
	} = useContext(Context);
	const [info, setInfo] = useState({
		proposalData: null,
		sendProposalModal: false,
	});

	useEffect(() => {
		return () => {
			updateProposalContent(null);
		};
	}, []);

	useEffect(() => {
		if (proposalInfo) {
			console.log('proposalData', proposalInfo);
			setInfo((prev) => ({ ...prev, proposalData: proposalInfo }));
		}
	}, [proposalInfo]);

	//functions definations

	//tableData changes
	const handleTableDataChange = useCallback(
		async (newData, tableDataIndex) => {
			const updatedTableData = [...(info?.proposalData?.tables || [])];
			updatedTableData?.splice(tableDataIndex, 1, newData);
			setInfo((prev) => ({ ...prev, tables: updatedTableData }));
		},
		[info?.proposalData],
	);

	const handleVariableDataChange = useCallback(
		async (newData, index) => {
			const updatedVariables = [...(info?.proposalData?.variables || [])];
			updatedVariables?.splice(index, 1, newData);
			setInfo((prev) => ({ ...prev, variables: updatedVariables }));
		},
		[info?.proposalData],
	);

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
				<div
					className="sendProposalButton"
					onClick={() => setInfo((prev) => ({ ...prev, sendProposalModal: true }))}
				>
					<p>Send Proposal</p>
				</div>
			</div>

			<div className="propsosEditContainer">
				<div className="previewContainer">
					<FileVariablesBlock
						variablesData={info?.proposalData?.variables}
						onVariableDatChnage={handleVariableDataChange}
					/>
					<ClientVariablesBlock />
					<ProposalExpiry />
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

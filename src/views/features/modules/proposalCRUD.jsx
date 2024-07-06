import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/proposals.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import ServicesBlock from '../../components/proposalComponents/ServicesBlock';
import VariablesBlock from '../../components/proposalComponents/VariablesBlock';
import ProposalExpiry from '../../components/proposalComponents/ProposalExpiry';
import PaymentSchedule from '../../components/proposalComponents/PaymentSchedule';
import EventsBlock from '../../components/proposalComponents/EventsBlock';
import { useParams, useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import InvoiceBlock from '../../components/proposalComponents/InvoiceBlock';
import FileVariablesBlock from '../../components/proposalComponents/FileVariablesBlock';
import ClientVariablesBlock from '../../components/proposalComponents/ClientVariablesBlock';

function ProposalCRUD(props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const { proposalId } = useParams();
	const versionId = Object.fromEntries(searchParams)?.verison;
	const {
		proposals: { getAllProposalContentInfo, proposalInfo },
	} = useContext(Context);
	const [info, setInfo] = useState({
		proposalData: null,
	});

	//useEffects
	useEffect(() => {
		getAllProposalContentInfo(proposalId, versionId);
	}, []);

	useEffect(() => {
		if (proposalInfo) {
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
				<div className="titleAndBackButton">
					<LeftArrow /> <p>create new File for *client name here*</p>
				</div>
				<div className="sendProposalButton">
					<p>Send Proposal</p>
				</div>
			</div>

			<div className="propsosEditContainer">
				<div className="previewContainer">
					<FileVariablesBlock />
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
					{info?.proposalData?.variables?.map((item, index) => (
						<VariablesBlock
							key={index}
							variableData={item || {}}
							selectedIndex={index}
							onChangeFunc={handleVariableDataChange}
						/>
					))}

					<PaymentSchedule />
				</div>
			</div>
		</div>
	);
}

export default ProposalCRUD;

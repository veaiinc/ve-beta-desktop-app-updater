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

	return (
		<div className="proposalsContainer">
			<div className="header">
				<div className="titleAndBackButton">
					<LeftArrow /> <p>Create New Proposals</p>
				</div>
				<div className="sendProposalButton">
					<p>Send Proposal</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="propsosEditContainer">
				<div className="previewContainer">
					<p className="heading">Proposal Preview</p>
					<div></div>
				</div>
				<div className="verticalDivider"></div>
				<div className="editContainer">
					<div className="heading">necessary fields</div>
					{info?.proposalData?.tables
						?.filter((ele) => ele?.type === 'services')
						?.map((item, index) => (
							<ServicesBlock
								serviceData={item || {}}
								selectedIndex={index}
								onChangeFunc={handleTableDataChange}
							/>
						))}
					<VariablesBlock />
					<EventsBlock />
					<PaymentSchedule />
					<ProposalExpiry />
				</div>
			</div>
		</div>
	);
}

export default ProposalCRUD;

import React from 'react';
import '../../../assets/scss/modules/proposal/proposals.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import ServicesBlock from '../../components/proposalComponents/ServicesBlock';
import VariablesBlock from '../../components/proposalComponents/VariablesBlock';
import ProposalExpiry from '../../components/proposalComponents/ProposalExpiry';
import PaymentSchedule from '../../components/proposalComponents/PaymentSchedule';
import EventsBlock from '../../components/proposalComponents/EventsBlock';

function ProposalCRUD(props) {
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
					<ServicesBlock />
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

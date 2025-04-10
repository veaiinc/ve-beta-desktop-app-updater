import React from 'react';
import '../../../assets/scss/globalComponents/contactsWidget.scss';
import { ReactComponent as AiSuggest } from '../../../assets/svg/aiIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/arrowRightIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';

const aiSuggestOptions = [
	{ id: 1, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
	{ id: 2, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
	{ id: 3, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
];

const contactOptions = [
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 5 },
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 2 },
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 1 },
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 0 },
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 0 },
	{ id: 1, title: 'Brandon Rhiel Madsen', suggestion: 'New Message Received', count: 5 },
];
const ContactsWidget = ({ width, height }) => {
	return (
		<div className="contactsWidgetContainer" style={{ width: width, height: height }}>
			<div className="contactsWidgetBody">
				<div className="contactsWidgetBodyMainContainer">
					<div className="contactsWidgetBodyHeader">
						<AiSuggest />
						<span className="contactsWidgetBodyHeaderTitle">AI Suggested actions</span>
					</div>
					<div className="contactsWidgetBodyBody">
						{aiSuggestOptions.map((contact) => (
							<div className="contactsWidgetBodyBodyItem">
								<div className="contactsWidgetOptionDetails">
									<div className="contactsWidgetOptionDetailsTitle">
										{contact.title}
									</div>
									<div className="contactsWidgetOptionDetailsSubtitle">
										{contact.subtitle}
									</div>
								</div>
								<ArrowRightIcon />
							</div>
						))}
					</div>
				</div>
				{contactOptions.map((eachOption) => (
					<div className="contactsEachOptions">
						<div className="contactDetails">
							<div className="contactDetailsTitle">{eachOption.title}</div>
							<div className="contactDetailsSubtitle">{eachOption.suggestion}</div>
						</div>
						<div className="contactDetailsCount">{eachOption.count}</div>
					</div>
				))}
			</div>
			<div className="contactsWidgetFooter">
				<div className="contactsWidgetFooterTitle">View Contacts</div>
				<PlusIcon />
			</div>
		</div>
	);
};

export default ContactsWidget;

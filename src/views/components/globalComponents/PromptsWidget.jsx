import React, { useState } from 'react';
import { PromptData } from '../homePage/PromptData';
import '../../../assets/scss/globalComponents/promptWidget.scss';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
import { ReactComponent as CalendarIcon } from '../../../assets/svg/contacts/calendar.svg';
import { ReactComponent as ContactsIcon } from '../../../assets/svg/contacts/contact.svg';
import PromptPopup from '../homePage/PromptPopup';

const iconMap = {
	automation: <AutomationIcon />,
	deepsearch: <DeepSearchIcon />,
	task: <TaskSuggestionIcon />,
	calendar: <CalendarIcon />,
	contacts: <ContactsIcon />,
};
const PromptsWidget = ({ option = '' }) => {
	const [info, setInfo] = useState({
		selectedCard: null,
		promptPopupOpen: false,
	});

	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
	};
	return (
		<>
			<div className="calenderWidgetSection2">
				{PromptData.filter((item) => item.type === option).map((item) => (
					<div
						className="calenderWidgetSection2Item"
						onClick={() => handlePromptPopup(item)}
					>
						<div className="calenderWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="calenderWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div className="calenderWidgetSection2ItemSubtitle">{item.title}</div>
					</div>
				))}
			</div>
			<PromptPopup
				open={info?.promptPopupOpen}
				closeModal={() =>
					setInfo((prev) => ({ ...prev, promptPopupOpen: false, selectedCard: null }))
				}
				selectedCard={info?.selectedCard}
			/>
		</>
	);
};
export default PromptsWidget;

import React, { useState } from 'react';
import { PromptData } from '../homePage/PromptData';
import '../../../assets/scss/globalComponents/promptWidget.scss';
import AutomationIcon from '../../../assets/svg/contacts/automation.svg?react';
import DeepSearchIcon from '../../../assets/svg/contacts/deepsearch.svg?react';
import TaskSuggestionIcon from '../../../assets/svg/contacts/tasksuggestion.svg?react';
import CalendarIcon from '../../../assets/svg/contacts/calendar.svg?react';
import ContactsIcon from '../../../assets/svg/contacts/contact.svg?react';
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
				{PromptData.filter((item) => item.type === option).map((item, index) => (
					<div
						key={index}
						className="calenderWidgetSection2Item"
						onClick={() => handlePromptPopup(item)}
					>
						<div className="calenderWidgetSection2ItemContainer">
							{iconMap[item?.type]}
							<div className="calenderWidgetSection2ItemTitle">
								{item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)}
							</div>
						</div>
						<div className="calenderWidgetSection2ItemSubtitle">{item?.title}</div>
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

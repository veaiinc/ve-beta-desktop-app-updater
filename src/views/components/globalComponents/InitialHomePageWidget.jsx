import React, { useMemo } from 'react';
import CalenderWidget from './CalenderWidget';
import PromptsWidget from './PromptsWidget';
import TaskWidget from './TaskWidget';
import AutomationWidget from './AutomationWidget';
import ContactsWidget from './ContactsWidget';

const divStyles = {
	display: 'flex',
	alignItems: 'flex-start',
	gap: '12px',
	alignSelf: 'stretch',
	borderRadius: '24px',
	margin: '0 auto',
	justifyContent: 'center',
	width: '903px',
};
const GlobalWidget = ({ option = '' }) => {
	const componentMapper = useMemo(() => ({
		calendar: <CalenderWidget />,
		task: <TaskWidget />,
		automation: <AutomationWidget />,
		contacts: <ContactsWidget />,
	}));
	return (
		<div style={divStyles}>
			{option ? componentMapper[option] : <CalenderWidget />}
			<PromptsWidget option={option} />
		</div>
	);
};
export default GlobalWidget;

import React, { memo } from 'react';

import PromptsWidget from './PromptsWidget';

const divStyles = {
	display: 'flex',
	alignItems: 'flex-start',
	gap: '12px',
	alignSelf: 'stretch',
	borderRadius: '24px',
	margin: '0 auto',
	justifyContent: 'center',
	width: '924px',
	flexDirection: 'column',
};
const GlobalWidget = ({ option = '' }) => {
	// const componentMapper = useMemo(() => ({
	// 	calendar: <CalenderWidget />,
	// 	task: <TaskWidget />,
	// 	automation: <AutomationWidget />,
	// 	contacts: <ContactsWidget />,
	// }));
	return (
		<div style={divStyles}>
			{/* {option ? componentMapper[option] : <CalenderWidget />} */}
			<PromptsWidget option={option} />
		</div>
	);
};
export default memo(GlobalWidget);

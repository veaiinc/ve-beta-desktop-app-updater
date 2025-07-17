import { memo, useContext, useState } from 'react';
import Context from '../../../context/context';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';

const component = () => {
	const {
		templates: { currentSessionId },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId1: ObjectID().toString(),
		sessionId2: '6878c200775a4e5ac8cee547',
	});

	return (
		<div style={{ display: 'flex', gap: '10px', width: '100%', height: '100%' }}>
			<RecentChat sId={info?.sessionId1} isPreview />
			<RecentChat sId={info?.sessionId2} isPreview />
		</div>
	);
};

export default memo(component);

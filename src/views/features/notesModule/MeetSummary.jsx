import { memo } from 'react';
import Editor from '../../components/notes/Editor';

const MeetSummary = ({ summary = '' }) => {
	return (
		<Editor
			innerContainerStyle={innerContainerStyle}
			myAccess={info?.myAccess}
			isDeleted={info?.isDeleted}
			customSendMessage={customSendMessage}
			aiResonse={info?.aiResonse}
			resetAiResponse={resetAiResponse}
			noteId={noteId}
			initialBlocks={blocks}
		/>
	);
};

export default memo(MeetSummary);

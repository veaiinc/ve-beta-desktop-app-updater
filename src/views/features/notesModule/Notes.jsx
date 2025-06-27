import React, { memo } from 'react';
import NotesEditor from './NotesEditor';
const Notes = ({ createSocketConnection, closeSocketConnection }) => {
	return (
		<NotesEditor
			createSocketConnection={createSocketConnection}
			closeSocketConnection={closeSocketConnection}
		/>
	);
};

export default memo(Notes);

import React, { memo } from 'react';
import NotesEditor from './NotesEditor';
const Notes = ({ handleSocketConnection }) => {
	return <NotesEditor handleSocketConnection={handleSocketConnection} />;
};

export default memo(Notes);

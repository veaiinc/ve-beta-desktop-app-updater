import React, { memo } from 'react';
import NotesEditor from './NotesEditor';
import DatabaseWithNote from './DatabaseWithNote';
const Notes = ({ isDatabase = false }) => {
	return isDatabase ? <DatabaseWithNote /> : <NotesEditor />;
};

export default memo(Notes);

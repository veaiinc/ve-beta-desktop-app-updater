import React, { memo } from 'react';
import '../../../assets/scss/notes/index.scss';
import NoteComponent from '../../components/notes/NoteComponent';

const Notes = () => {
	return <NoteComponent />;
};

export default memo(Notes);

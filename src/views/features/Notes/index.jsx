import React, { memo } from 'react';
import '../../../assets/scss/notes/index.scss';
import NoteComponent from '../../components/notes/NoteComponent';

const Notes = () => {
	const newMd =
		'| City          | Approximate Population |\n|---------------|------------------------|\n| Gachibowli    | 100,000                |\n| Shamshabad    | 50,000                 |\n| Kukatpally    | 200,000                |\n| Mallapur      | 30,000                 |\n| Hi-Tech City  | 50,000                 |\n| Habsiguda     | 40,000                 |\n| Jubilee Hills | 30,000                 |\n| Secunderabad  | 600,000                |\n\nTotal population of Hyderabad city in 2025 is approximately 11,228,000.';
	return <NoteComponent initialContent={newMd} />;
};

export default memo(Notes);

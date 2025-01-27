import React, { memo } from 'react';
import '../../../assets/scss/docs/index.scss';
// import { ReactComponent as Files } from '../../../assets/svg/docs/files.svg';
// import { fetchOriginSelection } from '../../../helpers';
// import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import ClientListView from './clientsListView';
// let origin = fetchOriginSelection();
const Contacts = () => {
	// const onGenerateAIFunc = () => {
	// 	window.location.href = `${origin}/generate`;
	// };
	return (
		<div className="docsParentContainer">
			<div className="docsFooterContainer">
				<ClientListView />
			</div>
		</div>
	);
};

export default memo(Contacts);

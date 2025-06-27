import { memo } from 'react';
import '../../../assets/scss/chat/aiTranscriptionSuggestions.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';

import { Drawer } from 'antd';
const AiTranscriptionSuggestions = ({ data, modalIsOpen, closeModal }) => {
	return (
		<Drawer
			open={modalIsOpen}
			rootClassName="ai-transcription-suggestions-drawer"
			width={400}
			mask={false}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="ai-transcription-suggestions-container">
				<div className="header">
					{/* <div className="close-icon-container" onClick={closeModal}>
						<CloseIcon />
					</div> */}
					<div className="header-title">Suggestions</div>
				</div>
				<div className="body"></div>
			</div>
		</Drawer>
	);
};

export default memo(AiTranscriptionSuggestions);

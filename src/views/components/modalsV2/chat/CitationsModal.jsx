import { Drawer } from 'antd';
import '../../../../assets/scss/chat/modal/citationsModal.scss';
import { ReactComponent as CitationCloseIcon } from '../../../../assets/svg/ai_agents/expand-chat-icon.svg';

const CitationsModal = ({ closeModal, modalIsOpen }) => {
	return (
		<Drawer
			open={modalIsOpen}
			rootClassName="citations-modal"
			width={400}
			mask={false}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="citations-container">
				<div className="header">
					<div className="text">Sources</div>
					<div className="close-modal-icon" onClick={closeModal}>
						<CitationCloseIcon />
					</div>
				</div>
				<div className="sources">
					<div className="source-container">
						<div className="image">r</div>
						<div className="info">
							<div className="name">knfekf</div>
							<div className="count">8</div>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default CitationsModal;

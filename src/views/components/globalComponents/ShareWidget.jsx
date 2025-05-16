import { memo } from 'react';
import ReactModal from '../modalsV2/index';
import '../../../assets/scss/globalComponents/ShareWidget.scss';
import { ReactComponent as CrossWhite } from '../../../assets/svg/Settings/CrossWhite.svg';
import { message } from '../globalComponents/CustomToast';

const ShareWidget = ({
	isOpen,
	onClose,
	shareUrl,
	title = 'Share',
	onCopyLink,
	onCopyEmbedded,
	embeddedCode,
	customStyles = {},
}) => {
	const handleCopyLink = () => {
		if (onCopyLink) {
			onCopyLink();
			return;
		}

		if (!shareUrl) {
			message.error('Share URL is not available');
			return;
		}

		navigator.clipboard.writeText(shareUrl);
		message.success('Link copied to clipboard');
	};

	const handleCopyEmbedded = () => {
		if (onCopyEmbedded) {
			onCopyEmbedded();
			return;
		}

		if (!embeddedCode) {
			message.error('Embedded code is not available');
			return;
		}

		navigator.clipboard.writeText(embeddedCode);
		message.success('Embedded code copied to clipboard');
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 50002,
					...customStyles.content,
				},
				overlay: {
					zIndex: 50000,
					...customStyles.overlay,
				},
			}}
			className="share-widget-modal"
		>
			<div className="share-widget">
				<div className="share-widget-header">
					<div className="share-widget-header-left">
						<div className="share-title">{title}</div>
					</div>
					<CrossWhite onClick={onClose} className="cursor-pointer" />
				</div>

				<div className="share-widget-body">
					<div className="link-container">
						<div className="link-container-wrapper">
							<div className="link-input-container">
								<div className="domain-section">{shareUrl}</div>
							</div>
						</div>
					</div>

					<div className="button-wrapper">
						{embeddedCode && (
							<button className="action-button" onClick={handleCopyEmbedded}>
								Copy Embed Code
							</button>
						)}
						<button className="action-button" onClick={handleCopyLink}>
							Copy Link
						</button>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ShareWidget);

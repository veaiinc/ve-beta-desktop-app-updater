import { Drawer } from 'antd';
import '../../../../assets/scss/chat/modal/citationsModal.scss';
import { useContext, memo, useCallback } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import {
	fileTypeIcons,
	getFaviconUrl,
	getWebsiteName,
	redirectTo,
	redirectTypeMapper,
} from '../../../../helpers';
import { ReactComponent as VeLogoSvg } from '../../../../assets/svg/veLogo.svg';

const styles = {
	header: { display: 'none' },
	body: { padding: '0px' },
};

const CitationsModal = ({ closeModal, modalIsOpen }) => {
	const {
		templates: { chatSources },
	} = useContext(Context);

	const handleSourceClick = useCallback((citation) => {
		redirectTo?.(citation?.type, citation?.[redirectTypeMapper?.[citation?.type]]);
	}, []);

	return (
		<Drawer
			open={modalIsOpen}
			rootClassName="citations-modal"
			width={400}
			mask={false}
			styles={styles}
		>
			<div className="citations-container">
				<div className="header">
					<div className="left-text">Sources</div>
					<div className="close-modal-icon" onClick={closeModal}>
						<CloseSvg style={{ width: '20px', height: '20px' }} />
					</div>
				</div>
				<div className="chat-sources">
					{chatSources?.map((citation, index) => {
						return (
							<div
								className="source-container"
								key={`${Date.now()}-${index}`}
								onClick={() => handleSourceClick(citation)}
								style={{
									animationDelay: `${index * 0.05 + 0.2}s`,
								}}
							>
								<div className="source-url-container">
									<div className="url-icon">
										{citation?.type === 'url' ? (
											getFaviconUrl(citation?.name) ? (
												<img
													src={getFaviconUrl(citation?.name)}
													alt="favicon"
													className="source-favicon-image"
												/>
											) : (
												<div className="source-icon">
													{getWebsiteName(citation?.name)?.charAt(0)}
												</div>
											)
										) : (
											<div className="source-icon">
												{citation?.type === 's3_key'
													? fileTypeIcons[
															citation?.name?.match(/\.(\w+)$/)?.[1]
													  ] || <VeLogoSvg />
													: fileTypeIcons[citation?.type] || (
															<VeLogoSvg />
													  )}
											</div>
										)}
									</div>
									<div className="url-text">
										{citation?.type === 'url'
											? getWebsiteName(citation?.name || '')
											: citation?.name || ''}
									</div>
								</div>
								{citation?.title && (
									<div className="source-title-container">
										{citation?.title || ''}
									</div>
								)}
								{citation?.snippet && (
									<div className="source-description-container">
										{citation?.snippet || ''}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(CitationsModal);

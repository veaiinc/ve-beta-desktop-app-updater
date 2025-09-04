import { memo, useContext, useState } from 'react';
import ReactModal from '../modalsV2/index';
import '../../../assets/scss/globalComponents/ShareWidget.scss';
import { ReactComponent as CrossWhite } from '../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/ai_assistant/url.svg';
import { message } from '../globalComponents/CustomToast';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import Spinner from '../loaders/Spinner';
//navigator.clipboard.writeText(copyLinkUrl);
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
	const url = new URL(shareUrl);
	const baseUrl = `${url.origin}/`;
	const slug = url.pathname.replace('/', '');
	const { id } = useParams();

	const {
		templates: { isSlugAvailable, updateSlug },
	} = useContext(Context);

	const [info, setInfo] = useState({
		editedSlug: slug,
		editShareUrlSlug: false,
		updateSlugLoading: false,
	});

	const toggleEditShareUrlSlug = () =>
		setInfo((prev) => ({ ...prev, editShareUrlSlug: !prev.editShareUrlSlug }));

	const handleEditSlug = (e) => {
		const editedSlug = e.target.value;
		setInfo((prev) => ({
			...prev,
			editedSlug,
		}));
	};

	const handleUpdateSlug = async () => {
		if (info.editedSlug === '') {
			message.error('Hey! The slug cannot be empty.');
			setInfo((prev) => ({
				...prev,
				editedSlug: slug,
				editShareUrlSlug: false,
			}));
			return;
		}
		if (info.editedSlug === slug) {
			setInfo((prev) => ({
				...prev,
				editShareUrlSlug: false,
			}));
			return;
		}
		setInfo((prev) => ({ ...prev, updateSlugLoading: true }));
		const slugAvailable = await isSlugAvailable({ slug: info.editedSlug });
		if (!slugAvailable) {
			message.error(`Oops! The slug /${info.editedSlug} is already taken.`);
			setInfo((prev) => ({
				...prev,
				updateSlugLoading: false,
				editedSlug: slug,
				editShareUrlSlug: false,
			}));
			return;
		}
		const response = await updateSlug({ slug: info.editedSlug, updateSlugId: id });
		const success = response[0],
			updatedSlug = response[1];
		if (!success) {
			message.error('An unexpected error occured while updating the slug');
			setInfo((prev) => ({
				...prev,
				editedSlug: slug,
				updateSlugLoading: false,
				editShareUrlSlug: false,
			}));
			return;
		}
		// message.success(`Updated your share url to ${baseUrl}${updatedSlug}`);
		setInfo((prev) => ({ ...prev, editedSlug: updatedSlug, updateSlugLoading: false }));

		const updatedLink = `${baseUrl}${updatedSlug}`;
		navigator.clipboard.writeText(updatedLink);
		message.success('Link copied to clipboard');
		toggleEditShareUrlSlug();
	};

	const handleCancelEdit = () => {
		setInfo((prev) => ({
			...prev,
			editedSlug: slug,
			editShareUrlSlug: false,
		}));
	};

	const handleCopyLink = () => {
		if (info.editedSlug !== slug) {
			navigator.clipboard.writeText(`${baseUrl}${info.editedSlug}`);
			message.success('Form link copied to clipboard');
			return;
		}
		if (onCopyLink) {
			onCopyLink();
			onClose();
			return;
		}

		if (!shareUrl) {
			message.error('Share URL is not available');
			return;
		}

		navigator.clipboard.writeText(shareUrl);
		message.success('Link copied to clipboard');
		onClose();
	};

	const handleCopyEmbedded = () => {
		if (onCopyEmbedded) {
			onCopyEmbedded();
			onClose();
			return;
		}

		if (!embeddedCode) {
			message.error('Embedded code is not available');
			return;
		}

		navigator.clipboard.writeText(embeddedCode);
		message.success('Embedded code copied to clipboard');
		onClose();
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
								<div className="domain-section-wrapper">
									<div
										onClick={toggleEditShareUrlSlug}
										className="domain-section"
									>
										<span className="baseUrl">{baseUrl}</span>
										{info.editShareUrlSlug ? (
											<input
												name="slugEditInput"
												value={info?.editedSlug}
												onChange={handleEditSlug}
												className="editShareUrlSlug"
												autoFocus
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleUpdateSlug();
													} else if (e.key === 'Escape') {
														handleCancelEdit();
													}
												}}
												type="text"
											/>
										) : (
											<span>{info.editedSlug}</span>
										)}
									</div>
									{!info.editShareUrlSlug && (
										<CopyIcon
											onClick={handleCopyLink}
											className="copy-icon cursor-pointer"
											title="Copy to clipboard"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="button-wrapper">
						{info.editShareUrlSlug ? (
							<>
								{info.updateSlugLoading ? (
									<Spinner
										width="18px"
										height="18px"
										color="var(--primary-button)"
										borderTopColor="transparent"
										borderWidth={1.5}
									/>
								) : (
									<>
										<button
											className="cancel-button"
											onClick={handleCancelEdit}
										>
											Cancel
										</button>
										<button className="save-button" onClick={handleUpdateSlug}>
											Save & Copy
										</button>
									</>
								)}
							</>
						) : (
							<>
								{embeddedCode && (
									<button className="action-button" onClick={handleCopyEmbedded}>
										Copy Embed Code
									</button>
								)}
								<button className="action-button" onClick={handleCopyLink}>
									Copy Link
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ShareWidget);

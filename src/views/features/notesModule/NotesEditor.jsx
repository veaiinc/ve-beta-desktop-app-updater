import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import '../../../assets/scss/notes/noteComponent.scss';
import NoteToolbar from '../../components/notes/NoteToolbar';
import ShareComponent from '../../components/notes/ShareComponent';
import { useEffect, memo, useContext, useCallback, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import MoreOptions from '../../components/notes/MoreOptions';
import { StarSvg } from '../../../assets/svg/notes/Star';
import DangerSvg from '../../../assets/svg/notes/danger.svg?react';
import CrossIcon from '../../../assets/svg/notes/cross.svg?react';
import { message } from '../../components/globalComponents/CustomToast';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import useChatStream from '../../hooks/useChatStream';
import ObjectID from 'bson-objectid';
import jwtDecode from 'jwt-decode';
import DustBinIcon from '../../../assets/svg/tasks/dustBin.svg?react';
import RestoreIcon from '../../../assets/svg/notes/restore.svg?react';
import { Tooltip } from 'antd';
import UploadPopup from '../../components/notes/UploadPopup';
import CustomizeAppearance from '../../components/notes/CustomizeAppearance';
import IconUploadPopup from '../../components/notes/IconUploadPopup';
import BackArrowSvg from '../../../assets/svg/workflow/backarrow.svg';

const initialState = {
	timeouts: {}, // Single timeouts object to store all timeouts
	title: '',
	updatedAt: '',
	notesConfigs: {
		smallText: false,
		fullWidth: false,
	},
	isFavorite: false,
	loading: true,
	aiResonse: '',
	myAccess: 'view',
	isDeleted: false,
	lastUpdated: null,
	deleteLoading: false,
	updatedBy: null,
	showUploadPopup: false,
	showCustomizeAppearance: false,
	coverImageError: false,
	localCoverImage: false, // cover image or link that is selected/uploaded before refreshing the page
	uploadType: null, // can be 'cover' or 'icon'
	showRemoveCoverBtn: false,
	showRemoveIconBtn: false,
	selectedEmoji: null,
	coverImageRemoved: false,
	iconImageRemoved: false,
};

const accessLevels = {
	full: 0,
	edit: 1,
	view: 2,
};

let userId = null;

const getRandomWidth = () => {
	const min = 70;
	const max = 100;
	return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

const skeletonLines = [...Array(10)]?.map(() => ({
	width: getRandomWidth(),
	height: 14,
}));

const NotesEditor = ({ outerContainerStyle, innerContainerStyle }) => {
	const { noteId } = useParams();
	const navigate = useNavigate();
	const aiResponseRef = useRef('');
	const prevDocRef = useRef([]);
	const originalFaviconRef = useRef(null);
	const { createWebSocketConnection, sendMessage } = useChatStream();

	const {
		notes: {
			getNotesPageData,
			notesPageData,
			notesAccess,
			saveNotesdata,
			updatePage,
			addToFavorite,
			removeFromFavorite,
			deletePage,
			duplicatePage,
			updateNotesState,
			getNotesAccess,
			globalAccess,
			uploadNotesImageBlock,
			deleteNotesImageBlock,
			notesDeleteCoverImage,
			notesDeleteIcon,
		},
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);

	// Derived states
	const coverImage = useMemo(() => {
		if (info?.coverImageRemoved) return false;
		return info?.localCoverImage
			? info.localCoverImage
			: info?.coverImageError
			? false
			: notesPageData?.data?.coverImage ?? false;
	}, [
		info?.localCoverImage,
		notesPageData?.data?.coverImage,
		info?.coverImageError,
		info?.coverImageRemoved,
	]);

	const iconImage = useMemo(() => {
		if (info?.iconImageRemoved) return false;
		let icon = notesPageData?.data?.iconImage;

		try {
			if (info?.selectedEmoji?.native) {
				return { native: info.selectedEmoji.native };
			}

			if (typeof icon === 'string') {
				icon = JSON.parse(icon);
				if (typeof icon === 'string') {
					icon = JSON.parse(icon);
				}
			}

			if (icon?.native) {
				return icon;
			}
		} catch (e) {
			console.error('Failed to parse iconImage:', e);
		}

		return null;
	}, [notesPageData?.data?.iconImage, info?.selectedEmoji?.native]);

	const editor = useCreateBlockNote({
		tables: {
			splitCells: true,
			cellBackgroundColor: true,
			cellTextColor: true,
			headers: true,
		},
		uploadFile,
	});

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		userId = user_id;
	}, []);

	useEffect(() => {
		const notesContainer = document.querySelector('.notes-container');
		const handleKeyDown = (e) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				const selected = editor?.getSelectedText()?.length > 0 || false;
				if (selected) {
					e.stopPropagation();
					return;
				}
			}
		};

		notesContainer.addEventListener('keydown', handleKeyDown);
		return () => notesContainer.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const originalFaviconTag = document.querySelector("link[rel~='icon']");

		if (originalFaviconRef.current === null) {
			originalFaviconRef.current = originalFaviconTag?.href ?? null;
		}

		if (!iconImage?.native) {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const link = document.createElement('link');
				link.rel = 'icon';
				link.href = originalFaviconRef.current;
				document.head.appendChild(link);
			}
			return;
		}

		const canvasSize = 256;
		const canvas = document.createElement('canvas');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(iconImage.native, canvasSize / 2, canvasSize / 2);

		const faviconUrl = canvas.toDataURL();

		document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
		const link = document.createElement('link');
		link.rel = 'icon';
		link.href = faviconUrl;
		document.head.appendChild(link);

		return () => {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const restoreLink = document.createElement('link');
				restoreLink.rel = 'icon';
				restoreLink.href = originalFaviconRef.current;
				document.head.appendChild(restoreLink);
			}
		};
	}, [iconImage]);

	// useEffect(() => {
	// 	getNotesAccess({ pageId: noteId });
	// }, [noteId]);

	useEffect(() => {
		if (noteId) {
			const sessionId = ObjectID()?.toString();
			getNotesPageDataFunc();
			createWebSocketConnection(sessionId, handleAiResponse);
		}

		return () => {
			updateNotesState({
				notesPageData: null,
			});
		};
	}, [noteId]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else if (info?.updatedBy) {
			const lastUpdated = tenantsUserList?.find((item) => item._id === info?.updatedBy);
			setInfo((prevInfo) => ({ ...prevInfo, lastUpdated }));
		}
	}, [tenantsUserList, info?.updatedBy]);

	useEffect(() => {
		if (noteId) {
			getNotesAccess({ pageId: noteId });
		}
	}, [noteId]);

	// Process access logic when relevant data changes
	useEffect(() => {
		if (notesAccess && userId && noteId) {
			const hasAccess = notesAccess.find((access) => access?.userId === userId);
			if (hasAccess) {
				let myAccess = hasAccess.access;

				if (globalAccess?.isEnabled) {
					const myAccessLevel = accessLevels?.[myAccess];
					const teamAccessLevel = accessLevels?.[globalAccess?.access];
					myAccess = myAccessLevel > teamAccessLevel ? globalAccess.access : myAccess;
				}

				setInfo((prev) => ({
					...prev,
					myAccess,
				}));
			}
		}
	}, [notesAccess, userId, noteId, globalAccess]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().includes('MAC');
			const isSaveShortcut =
				(isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's');

			if (isSaveShortcut) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		window.addEventListener('keydown', handleKeyDown, true); // true = capture phase

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, []);

	useEffect(() => {
		if (notesPageData?.data) {
			const {
				blocks = [],
				title = '',
				updatedAt = '',
				isFavorite = false,
				isDeleted = false,
				updatedBy = null,
			} = notesPageData?.data || {};
			if (blocks) {
				loadNotesContent(blocks);
			}
			setInfo((prev) => ({
				...prev,
				title,
				updatedAt,
				isFavorite,
				isDeleted,
				updatedBy,
			}));
		} else if (notesPageData?.error) {
			const messageText =
				notesPageData?.error?.message ||
				'Something went wrong while fetching this note, please try again';
			message.error(messageText);
			setTimeout(() => {
				window.history.length > 1 ? navigate(-1) : navigate('/');
			}, 3100);
		}
	}, [notesPageData]);

	useEffect(() => {
		return () => {
			// Clear all timeouts on unmount
			Object.values(info.timeouts).forEach(clearTimeout);
		};
	}, [info.timeouts]);

	const getNotesPageDataFunc = useCallback(async () => {
		const payload = {
			pageId: noteId,
		};
		getNotesPageData(payload);
	}, [noteId]);

	const loadNotesContent = useCallback(
		(data) => {
			if (data?.length) {
				editor.replaceBlocks(editor.document, data);
			}
			setInfo((prev) => ({ ...prev, loading: false }));
		},
		[editor],
	);

	// Generic debounce function
	const handleDebounce = useCallback(
		(key, callback, delay = 500) => {
			clearTimeout(info.timeouts[key]);
			const timeout = setTimeout(callback, delay);
			setInfo((prev) => ({
				...prev,
				timeouts: { ...prev.timeouts, [key]: timeout },
			}));
		},
		[info.timeouts],
	);

	const handleContentChange = useCallback(
		(data) => {
			handleDebounce('content', () => {
				const payload = {
					pageId: noteId,
					blocks: data || [],
				};
				saveNotesdata(payload);
				setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
			});
		},
		[noteId, handleDebounce],
	);

	const handleTitleChange = (e) => {
		const newTitle = e?.target?.value;
		setInfo((prev) => ({ ...prev, title: newTitle }));

		handleDebounce('title', () => {
			updatePage({
				pageId: noteId,
				input: { title: newTitle },
			});
			setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
		});
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // optional: stops newline if it's a textarea
		}
	};

	const handleFavorite = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, isFavorite: value }));

			handleDebounce('favorite', async () => {
				const payload = { pageId: noteId };
				const [success] = value
					? await addToFavorite(payload)
					: await removeFromFavorite(payload);

				if (!success) {
					setInfo((prev) => ({ ...prev, isFavorite: !value }));
				}
			});
		},
		[noteId, handleDebounce],
	);

	const extractImageUrls = (doc) => {
		const urls = [];
		for (const block of doc) {
			if (block.type === 'image' && block.props?.url) {
				urls.push(block.props.url);
			}
		}
		return urls;
	};

	const onChange = () => {
		if (editor?.document?.length) {
			const newDoc = editor.document;
			const prevImages = extractImageUrls(prevDocRef.current);
			const newImages = extractImageUrls(newDoc);
			const removedImages = prevImages.filter((url) => !newImages.includes(url));
			for (const url of removedImages) {
				const payload = {
					pageId: noteId,
					imageInput: {
						imageUrl: url,
						type: 'block',
					},
				};
				deleteNotesImageBlock(payload);
			}

			handleContentChange(newDoc);
			prevDocRef.current = newDoc;
		}
	};

	const handleMoreOptionsChange = useCallback(
		(key, value) => {
			setInfo((prev) => ({
				...prev,
				notesConfigs: { ...prev.notesConfigs, [key]: value },
			}));
		},
		[setInfo],
	);

	const handleDeletePage = useCallback(
		async (permanent = false) => {
			if (info?.deleteLoading) return;
			setInfo((prev) => ({ ...prev, deleteLoading: true }));
			const [success] = await deletePage({ pageId: noteId, isPermanent: permanent });
			if (success) {
				message.success(`Page ${permanent ? 'permanently ' : ''}deleted successfully`);
				navigate('/files');
			} else {
				message.error('Failed to delete page');
			}
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
		},
		[info?.deleteLoading, info?.notesConfigs, navigate, noteId, setInfo],
	);

	const handleDuplicatePage = useCallback(async () => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		const [success, data] = await duplicatePage({ pageId: noteId });
		if (success) {
			message.success('Page duplicated successfully');
			// navigate(`/note/${data?._id}`);
		} else {
			message.error('Failed to duplicate page');
		}
		setInfo((prev) => ({ ...prev, loading: false }));
	}, [info?.loading, info?.notesConfigs, navigate, noteId, setInfo]);

	const handleAiResponse = (event) => {
		let { data = '' } = event || {};
		const dataObject = JSON.parse(data);

		if (dataObject.hasOwnProperty('answer')) {
			aiResponseRef.current = aiResponseRef.current + dataObject?.answer;

			if (dataObject?.stream_end) {
				setInfo((prevInfo) => ({
					...prevInfo,
					aiResonse: aiResponseRef.current,
				}));
			}
		}
	};

	const resetAiResponse = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, aiResonse: '' }));
		aiResponseRef.current = '';
	}, []);

	const customSendMessage = useCallback((query) => {
		sendMessage({
			date: [],
			deep_research: false,
			knowledge_base_search: false,
			modules: [],
			query,
			timezone: 'Asia/Calcutta',
			web_search: true,
		});
	}, []);

	const restorePage = async () => {
		if (info?.deleteLoading) return;
		setInfo((prev) => ({ ...prev, deleteLoading: true }));
		const response = await updatePage({
			pageId: noteId,
			input: { isDeleted: false },
		});
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				updatedAt: moment().unix(),
				isDeleted: false,
				deleteLoading: false,
			}));
			message?.success('Page restored!');
		} else {
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
			message?.error(`Couldn't restore page`);
		}
	};

	const handleCoverImageError = () => {
		setInfo((prev) => ({ ...prev, coverImageError: true }));
	};

	async function uploadFile(file) {
		const response = await uploadNotesImageBlock(
			{
				pageId: noteId,
				uploadPageBlockImageInput: {
					imageName: file?.name,
					imageSize: file?.size,
				},
			},
			file,
		);

		if (response?.[0]) {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			return response?.[1];
		}

		return undefined;
	}

	const handleRemoveCover = async () => {
		const response = await notesDeleteCoverImage({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Cover image removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveCoverBtn: false,
				localCoverImage: false,
				coverImageError: false,
				coverImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove cover image');
		}
	};

	const handleRemoveIcon = async () => {
		const response = await notesDeleteIcon({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Icon removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveIconBtn: false,
				selectedEmoji: null,
				iconImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove icon');
		}
	};

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
			{info?.title && (
				<Helmet>
					<meta charSet="utf-8" />
					<title>VE - {info?.title}</title>
				</Helmet>
			)}

			{!info?.isDeleted ? (
				<div className="notes-nav-menu">
					<div className="notes-nav-left">
						<div className="backBtnContainer">
							<span
								className="backBtn"
								onClick={() => navigate(-1)}
								aria-label="Go back to previous page"
							>
								<BackArrowSvg aria-hidden="true" />
								<span>Notes</span>
								<div>/</div>
							</span>
						</div>
						<div className="notes-nav-title">{info?.title}</div>
					</div>

					<div className="notes-nav-right">
						<button
							className="notes-nav-button"
							onClick={() => handleFavorite(!info?.isFavorite)}
						>
							<StarSvg
								fill={info?.isFavorite}
								width={18}
								height={18}
								className="cursor-pointer"
							/>
						</button>

						{info?.myAccess === 'full' && (
							<ShareComponent pageId={noteId} makeApiCall={false} />
						)}

						<MoreOptions
							notesConfigs={info?.notesConfigs}
							onChange={handleMoreOptionsChange}
							onDelete={handleDeletePage}
							onDuplicate={handleDuplicatePage}
						/>
					</div>
				</div>
			) : (
				<div className="deleted-badge">
					<div className="badge-text-wrapper">
						<DangerSvg />
						<p className="delete-badge-message">
							{info?.lastUpdated
								? `${info?.lastUpdated?.firstName} ${
										info?.lastUpdated?.lastName
											? info?.lastUpdated?.lastName
											: ''
								  } `
								: 'Someone '}
							moved this page to trash{' '}
							{info?.updatedAt ? moment?.unix(info?.updatedAt).fromNow() : ''}.
						</p>
					</div>

					<div className="badge-button-wrapper">
						<button className="delete-badge-restore-btn" onClick={restorePage}>
							<RestoreIcon />
							Restore
						</button>
						<button
							className="delete-badge-permanent-delete-btn"
							onClick={() => handleDeletePage(true)}
						>
							<DustBinIcon /> Permanently delete
						</button>
					</div>
				</div>
			)}

			<div className="notes-editor-container">
				{info?.loading ? (
					<div
						className="notes-editor-wrapper"
						style={{ maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px' }}
					>
						<div className="notes-title">
							<Skeleton
								width="90%"
								height={40}
								highlightColor="var(--card-hover)"
								baseColor="var(--card)"
							/>
						</div>

						<div className="notes-line-loader">
							{skeletonLines.map((line, i) => (
								<Skeleton
									key={i}
									height={line.height}
									width={line.width}
									highlightColor="var(--card-hover)"
									baseColor="var(--card)"
								/>
							))}
						</div>
					</div>
				) : (
					<>
						{coverImage && (
							<div
								onMouseEnter={() =>
									setInfo((prev) => ({ ...prev, showRemoveCoverBtn: true }))
								}
								onMouseLeave={() =>
									setInfo((prev) => ({ ...prev, showRemoveCoverBtn: false }))
								}
								className="notes-cover-image-container"
							>
								<img
									src={coverImage}
									onError={handleCoverImageError}
									alt="cover image"
								/>
								{info?.showRemoveCoverBtn && (
									<button
										onClick={handleRemoveCover}
										className="remove-cover-btn"
									>
										Remove
									</button>
								)}
							</div>
						)}
						<div
							className="notes-editor-wrapper"
							style={{ maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px' }}
						>
							<Tooltip
								open={info?.showCustomizeAppearance}
								onOpenChange={() => {
									if (info?.showUploadPopup) {
										setInfo((prev) => ({
											...prev,
											showUploadPopup: false,
										}));
									}
									setInfo((prev) => ({
										...prev,
										showCustomizeAppearance: !prev.showCustomizeAppearance,
									}));
								}}
								placement="bottomLeft"
								title={
									info?.showUploadPopup && info?.uploadType === 'cover' ? (
										<UploadPopup
											closePopup={() =>
												setInfo((prev) => ({
													...prev,
													showUploadPopup: false,
													showCustomizeAppearance: false,
												}))
											}
											setLocalCoverImage={(coverImage) =>
												setInfo((prev) => ({
													...prev,
													localCoverImage: coverImage,
													coverImageRemoved: false,
												}))
											}
											uploadType={info?.uploadType}
										/>
									) : info?.showUploadPopup && info?.uploadType === 'icon' ? (
										<IconUploadPopup
											setSelectedEmoji={(emoji) =>
												setInfo((prev) => ({
													...prev,
													selectedEmoji: emoji,
												}))
											}
											closePopup={() =>
												setInfo((prev) => ({
													...prev,
													showUploadPopup: false,
													showCustomizeAppearance: false,
												}))
											}
										/>
									) : (
										<CustomizeAppearance
											// uploadType can be 'cover' or 'icon'
											showUploadPopup={(uploadType) =>
												setInfo((prev) => ({
													...prev,
													showUploadPopup: true,
													uploadType,
												}))
											}
										/>
									)
								}
								overlayInnerStyle={{
									backgroundColor: 'inherit',
								}}
								arrow={false}
							>
								<div
									className="notes-icon-container"
									style={{
										paddingTop: coverImage
											? '42px'
											: iconImage
											? '100px'
											: '0px',
									}}
								>
									{iconImage && (
										<div
											className="notes-icon-wrapper"
											onMouseEnter={() =>
												setInfo((prev) => ({
													...prev,
													showRemoveIconBtn: true,
												}))
											}
											onMouseLeave={() =>
												setInfo((prev) => ({
													...prev,
													showRemoveIconBtn: false,
												}))
											}
											style={{
												top: coverImage
													? '-72px'
													: iconImage
													? '-10px'
													: '-24px',
											}}
										>
											{info?.showRemoveIconBtn && (
												<div className="remove-icon-btn-container">
													<CrossIcon
														className="remove-icon-btn"
														onClick={handleRemoveIcon}
													/>
												</div>
											)}
											{iconImage?.native}
										</div>
									)}
									<CustomTextArea
										className="notes-title"
										value={info?.title}
										onChange={handleTitleChange}
										autoResize={true}
										onKeyDown={handleKeyDown}
									/>
								</div>
							</Tooltip>
							<BlockNoteView
								editor={editor}
								formattingToolbar={false}
								onChange={onChange}
								style={innerContainerStyle || {}}
								theme={'dark'}
								editable={info?.myAccess !== 'view' || !info?.isDeleted}
							>
								{(info?.myAccess !== 'view' || !info?.isDeleted) && (
									<NoteToolbar
										sendMessage={customSendMessage}
										aiResonse={info?.aiResonse}
										resetAiResponse={resetAiResponse}
									/>
								)}
							</BlockNoteView>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default memo(NotesEditor);

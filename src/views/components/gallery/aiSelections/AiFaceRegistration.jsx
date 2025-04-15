import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import Table from './RegisteredUsersTable';
import QRCode from 'react-qr-code';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Progress, Tooltip } from 'antd';
import NotifyPopup from './NotifyPopup';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';

const AiFaceRegistration = ({ link }) => {
	const qrRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [info, setinfo] = useState({
		isNotifyPopupOpen: false,
		notifyType: null,
		numberOfImagesGroupedFaces: 0,
		numberOfImagesPeoples: 0,
		imagesCount: 0,
		initialLoading: false,
		scrollLoading: false,
	});

	const {
		galleryInfo: {
			getImagesReadyNotify,
			preRegisteredUsers,
			getPreRegisteredUsers,
			getImageProcessingStatus,
			imageProcessingStatus,
		},
	} = useContext(Context);
	const { galleryId } = useParams();
	useEffect(() => {
		if (!preRegisteredUsers) {
			setinfo((prev) => ({ ...prev, initialLoading: true }));
			getPreRegisteredUsers(galleryId, page).finally(() =>
				setinfo((prev) => ({ ...prev, initialLoading: false })),
			);
		}
	}, [preRegisteredUsers]);

	useEffect(() => {
		if (galleryId) {
			getImageProcessingStatus(galleryId);
		}
	}, []);

	const fetchMoreData = async () => {
		const nextPage = page + 1;
		setinfo((prev) => ({ ...prev, scrollLoading: true }));
		await getPreRegisteredUsers(galleryId, nextPage);
		setPage(nextPage);
		setinfo((prev) => ({ ...prev, scrollLoading: false }));
	};

	const notifyUser = async () => {
		try {
			const response = await getImagesReadyNotify(galleryId);
			const responseMessage = response?.[1]?.message;
			if (response?.[0] === 200) {
				message.success(responseMessage);
			} else {
				message.error(responseMessage);
			}
		} catch (error) {
			message.error('Failed to notify users');
		}
	};

	const downloadQR = () => {
		const canvas = document.createElement('canvas');
		const svg = qrRef.current.querySelector('svg');
		const svgData = new XMLSerializer().serializeToString(svg);
		const img = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);

			const pngFile = canvas.toDataURL('image/png');
			const downloadLink = document.createElement('a');
			downloadLink.download = 'qr-code.png';
			downloadLink.href = pngFile;
			downloadLink.click();
		};

		img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
	};
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(link);
			message.success('Link copied successfully!');
		} catch (err) {
			const textArea = document.createElement('textarea');
			textArea.value = link;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				message.success('Link copied successfully!');
			} catch (err) {
				message.error('Failed to copy link:', err);
			}
			document.body.removeChild(textArea);
		}
	};

	const openNotifyPopup = (type) => {
		notifyUser();
		// setinfo((prev) => ({
		// 	...prev,
		// 	isNotifyPopupOpen: true,
		// 	notifyType: type,
		// }));
	};

	return (
		<div className="aiFaceRegistration">
			<p className="heading">All data from the client gallery, album and selection views</p>
			<div className="aiScannerContainer">
				<div style={{ display: 'flex', gap: '30px' }}>
					<div className="scanner" ref={qrRef}>
						<QRCode
							value={link}
							style={{ height: '90%', maxWidth: '90%', width: '90%' }}
							size={120}
						/>
					</div>
					<div className="aiScannerDetailsContainer">
						<div className="aiScanLink">
							<p>{link ? link : ''}</p>
							<CopyIcon className="copyIcon" onClick={() => copyLink()} />
						</div>

						<div className="downloadNotifyContainer">
							<div className="downloadQR" onClick={() => downloadQR()}>
								<DownloadIcon className="downloadIcon" />
								<p>Download QR</p>
							</div>
							{/* {hasRegisteredUsers && (
								<div className="notifyUser" onClick={() => notifyUser()}>
									<span>Notify User</span>
								</div>
							)} */}
						</div>
					</div>
				</div>

				{imageProcessingStatus?.imagesCount !== 0 && (
					<div className="aiProcessingContainer">
						{/* <div className="close-button">
						<CloseIcon />
					</div> */}
						<p className="aiProcessingTotalImages">
							Total Images in Gallery: {imageProcessingStatus?.imagesCount || 0}
						</p>
						<div className="aiProcessingDetailsContainer">
							{imageProcessingStatus?.numberOfImagesPeoples !== 0 && (
								<div className="progress-bar">
									<Progress
										percent={parseInt(
											(imageProcessingStatus?.numberOfImagesGroupedFaces /
												imageProcessingStatus?.numberOfImagesPeoples) *
												100,
										)}
										type="circle"
										size={46}
										strokeColor="var(--stroke)"
										strokeWidth={12}
										trailWidth={12}
										trailColor="var(--secondary-font)"
										textStyle={{ color: 'var(--primary-font)' }}
									/>
								</div>
							)}
							<p className="aiProcessingText">
								{imageProcessingStatus?.numberOfImagesGroupedFaces !==
								imageProcessingStatus?.numberOfImagesPeoples
									? 'AI still Processing your images'
									: 'AI has processed all your images'}
							</p>

							{imageProcessingStatus?.numberOfImagesPeoples !== 0 && (
								<p className="aiProcessingText-count">
									<Tooltip title="no of processed images">
										<span style={{ color: 'var(--primary-font)' }}>
											{imageProcessingStatus?.numberOfImagesGroupedFaces}{' '}
										</span>
									</Tooltip>
									<Tooltip title="no of images with people">
										<span style={{ color: 'var(--secondary-font)' }}>
											/{imageProcessingStatus?.numberOfImagesPeoples}
										</span>
									</Tooltip>
								</p>
							)}
						</div>
						<br />
						<div className="aiProcessingButtonContainer">
							{preRegisteredUsers?.data?.length > 0 && (
								<button
									className="notify-all-button"
									onClick={() => openNotifyPopup('immediate')}
								>
									Notify Immediately{' '}
								</button>
							)}
							{/* <button
								className="notify-all-button"
								onClick={() => openNotifyPopup('all')}
							>
								Notify all at once{' '}
							</button> */}
						</div>
					</div>
				)}
			</div>
			<div
				className="tableWrapper"
				style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}
				id="table-scroll-container"
			>
				<InfiniteScroll
					dataLength={preRegisteredUsers?.data?.length || 0}
					next={fetchMoreData}
					hasMore={preRegisteredUsers?.metadata?.hasNextPage || false}
					loader={null}
					scrollableTarget="table-scroll-container"
					style={{ overflow: 'visible' }} // Important!
				>
					<Table
						tableData={preRegisteredUsers}
						thead={'Register Stage'}
						loading={info.initialLoading}
						scrollLoading={info.scrollLoading}
					/>
				</InfiniteScroll>
			</div>

			<NotifyPopup info={info} setinfo={setinfo} />
		</div>
	);
};

export default AiFaceRegistration;

import React, { useState, useRef, useContext, useEffect, useCallback, memo } from 'react';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import Table from './RegisteredUsersTable';
import QRCode from 'react-qr-code';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Progress, Switch, Tooltip } from 'antd';
import NotifyPopup from './NotifyPopup';
import { useParams } from 'react-router-dom';
import { message } from '../../globalComponents/CustomToast';

const AiFaceRegistration = ({ link, handlePreRegistration, preRegistration }) => {
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
		preRegisterLength: 0,
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

			getPreRegisteredUsers(galleryId, page).finally(() => {
				setinfo((prev) => ({
					...prev,
					initialLoading: false,
					preRegisterLength: 0, // Default to 0 if data is not yet available
				}));
			});
		} else {
			// Update preRegisterLength when preRegisteredUsers updates
			setinfo((prev) => ({
				...prev,
				preRegisterLength: preRegisteredUsers?.metadata?.totalDocs || 0,
			}));
		}
	}, [preRegisteredUsers, galleryId, page]);

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
			if (response?.[0] === true) {
				message.success(responseMessage);
			} else {
				message.error(responseMessage);
			}
		} catch (error) {
			message.error('Failed to notify users');
		}
	};

	const downloadQR = () => {
		const qrElement = qrRef.current?.querySelector('svg');

		if (!qrElement) {
			message.error('QR code not found.');
			return;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const desiredSize = 1000;
		const padding = 20; // Padding reduced to 20px
		const qrSize = desiredSize - padding * 2;

		canvas.width = desiredSize;
		canvas.height = desiredSize;

		const svgData = new XMLSerializer().serializeToString(qrElement);
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
		const svgUrl = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			// Add a white background
			ctx.fillStyle = '#FFFFFF'; // White background
			ctx.fillRect(0, 0, desiredSize, desiredSize); // Fill the entire canvas with white

			// Draw the QR code with reduced padding
			ctx.drawImage(img, padding, padding, qrSize, qrSize);

			// Generate PNG download
			const pngData = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'qr-code.png';
			link.href = pngData;
			link.click();
			URL.revokeObjectURL(svgUrl); // Clean up
		};
		img.src = svgUrl;
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
		<div
			className="aiFaceRegistration"
			style={{ height: info?.preRegisterLength ? '90vh' : '100%' }}
		>
			<div className="aiFaceHeaderContainer">
				<div className="aiFaceHeader">
					<div className="aiFaceTitleContainer">
						<div className="aiFaceTitle">Face Registration for guests</div>
						<div className="aiFaceCount">{info?.preRegisterLength || 0}</div>
					</div>
					<div className="aiFaceDescription">
						Share this QR code or link with guests to register their face.
					</div>
				</div>
				{/* <div
					className="aiFaceHeaderButtonContainer"
					onClick={() => handlePreRegistration(!preRegistration)}
				>
					<div className="aiFaceHeaderButton">Enable Preregistration</div>
					<Switch size="small" checked={preRegistration} />
				</div> */}
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
			<div
				className="aiScannerContainer"
				style={{
					borderBottom: info?.preRegisterLength > 0 ? '1px solid var(--stroke)' : 'none',
				}}
			>
				<div className="aiScannerContainer-inner">
					<div className="aiScannerContainer-inner-left">
						<div className="scanner" ref={qrRef}>
							<QRCode
								value={link}
								fgColor="#000000"
								bgColor="#FFFFFF"
								size={130}
								level="H"
							/>
						</div>
						<div
							className="downloadQR"
							onClick={() => downloadQR()}
							style={{ cursor: 'pointer' }}
						>
							<DownloadIcon className="downloadIcon" />
							<p>Download QR</p>
						</div>
					</div>
					<div className="aiScannerOrContainer">
						<div className="aiScannerOrContainer-line"></div>
						<div className="aiScannerOrContainer-or">Or</div>
						<div className="aiScannerOrContainer-line"></div>
					</div>
					<div className="aiScannerDetailsContainer">
						<div className="aiScanLink">
							<div className="shareLinktext">Share Link</div>
							<div className="shareLinkContainer">
								<div className="shareLink">
									<p>{link ? link : ''}</p>
								</div>
								<div
									className="copyIcon"
									onClick={() => copyLink()}
									style={{ cursor: 'pointer' }}
								>
									<CopyIcon />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* {info?.preRegisterLength > 0 && preRegistration ? (
				<div
					className="tableWrapper"
					style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}
					id="table-scroll-container"
				>
					<InfiniteScroll
						dataLength={info?.preRegisterLength || 0}
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
			) : (
				<div className="noPreRegistration">
					<div className="noPreRegistration-title">Preregistration Disabled</div>
					<div className="noPreRegistration-description">
						Keep your schedule organized by allowing users to preregister.
					</div>
				</div>
			)} */}
			{preRegisteredUsers ? (
				<>
					{preRegisteredUsers?.data?.length > 0 ? (
						<div
							className="tableWrapper"
							style={{
								// flex: 1,
								overflowY: 'auto',
							}}
							id="table-scroll-container"
						>
							<div className="table-header">
								<table>
									<thead>
										<tr>
											<th>Name or Email</th>
											<th>Register Stage</th>
											<th>Date</th>
										</tr>
									</thead>
								</table>
							</div>
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
									tableHeader={true}
								/>
							</InfiniteScroll>
						</div>
					) : (
						<div className="noPreRegistration">
							<div className="noPreRegistration-title">No registered users</div>
							<div className="noPreRegistration-description">
								Keep your schedule organized by allowing users to preregister.
							</div>
						</div>
					)}
				</>
			) : (
				<div className="noPreRegistration">
					<div className="noPreRegistration-title">Preregistration Disabled</div>
					<div className="noPreRegistration-description">
						Keep your schedule organized by allowing users to preregister.
					</div>
				</div>
			)}
			<NotifyPopup info={info} setinfo={setinfo} />
		</div>
	);
};

export default memo(AiFaceRegistration);

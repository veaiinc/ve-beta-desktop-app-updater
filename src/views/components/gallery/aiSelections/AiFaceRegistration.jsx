import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import Table from './RegisteredUsersTable';
// import QRCode from 'react-qr-code';
import { QRCodeCanvas } from 'qrcode.react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message, Progress, Tooltip } from 'antd';
import NotifyPopup from './NotifyPopup';
import { useParams } from 'react-router-dom';

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
					preRegisterLength: preRegisteredUsers?.data?.length,
				}));
			});
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
			if (response?.[0]) {
				message.success('Users notified successfully');
			} else {
				message.error('Failed to notify users');
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
		<div
			className="aiFaceRegistration"
			style={{ height: info?.preRegisterLength ? '90vh' : '100%' }}
		>
			<p className="heading">All data from the client gallery, album and selection views</p>
			<div
				className="aiScannerContainer"
				style={{
					borderBottom: info?.preRegisterLength > 0 ? '1px solid var(--stroke)' : 'none',
				}}
			>
				<div className="aiScannerContainer-inner">
					<div className="aiScannerContainer-inner-left">
						<div className="scanner" ref={qrRef}>
							<QRCodeCanvas
								value={link}
								fgColor="#7A7E85"
								bgColor="#171819"
								size={120}
							/>
						</div>
						<div className="downloadQR" onClick={() => downloadQR()}>
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
								<div className="copyIcon" onClick={() => copyLink()}>
									<CopyIcon />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{info?.preRegisterLength > 0 && (
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
			)}
			<NotifyPopup info={info} setinfo={setinfo} />
		</div>
	);
};

export default AiFaceRegistration;

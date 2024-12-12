import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import Context from '../../../../context/context';
import Table from './RegisteredUsersTable';
import QRCode from 'react-qr-code';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message } from 'antd';

const AiFaceRegistration = ({ link, galleryId }) => {
	const qrRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const observer = useRef();
	const {
		galleryInfo: { getImagesReadyNotify, preRegisteredUsers, getPreRegisteredUsers },
	} = useContext(Context);

	useEffect(() => {
		if (!preRegisteredUsers) {
			setLoading(true);
			getPreRegisteredUsers(galleryId, page).finally(() => setLoading(false));
		}
	}, [preRegisteredUsers]);

	const fetchMoreData = () => {
		const nextPage = page + 1;
		setLoading(true);
		getPreRegisteredUsers(galleryId, nextPage)
			.then(() => {
				setPage(nextPage);
			})
			.finally(() => setLoading(false));
	};

	const lastElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && preRegisteredUsers?.metadata?.hasNextPage) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, preRegisteredUsers?.metadata?.hasNextPage],
	);

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

	return (
		<div className="aiFaceRegistration">
			<p className="heading">All data from the client gallery, album and selection views</p>
			<div className="aiScannerContainer">
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
						<div className="notifyUser" onClick={() => notifyUser()}>
							<span>Notify User</span>
						</div>
					</div>
				</div>
			</div>
			<div className="tableContainer">
				<InfiniteScroll
					dataLength={preRegisteredUsers?.data?.length || 0}
					next={fetchMoreData}
					hasMore={preRegisteredUsers?.metadata?.hasNextPage || false}
					loader={<Table loading={true} />}
					scrollableTarget="registeredUsers-scroll"
					scrollThreshold={0.8}
				>
					<Table
						tableData={preRegisteredUsers}
						thead={'Register Stage'}
						loading={loading && !preRegisteredUsers?.data?.length}
					/>
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default AiFaceRegistration;

import React, { useRef, useContext, useEffect } from 'react';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import Context from '../../../../context/context';

import Table from './Table';
import QRCode from 'react-qr-code';
import { message } from 'antd';

const tableData = [
	{
		name: 'John Doe',
		email: 'john.doe@example.com',
		mobileNumber: '+1 234-567-8901',
		registerStage: 'Completed',
		date: '2024-03-20',
	},
	{
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		mobileNumber: '+1 345-678-9012',
		registerStage: 'Pending',
		date: '2024-03-19',
	},
	{
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		mobileNumber: '+1 456-789-0123',
		registerStage: 'In Progress',
		date: '2024-03-18',
	},
	{
		name: 'Sarah Williams',
		email: 'sarah.w@example.com',
		mobileNumber: '+1 567-890-1234',
		registerStage: 'Completed',
		date: '2024-03-17',
	},
	{
		name: 'Robert Brown',
		email: 'robert.b@example.com',
		mobileNumber: '+1 678-901-2345',
		registerStage: 'Pending',
		date: '2024-03-16',
	},
	{
		name: 'John Doe',
		email: 'john.doe@example.com',
		mobileNumber: '+1 234-567-8901',
		registerStage: 'Completed',
		date: '2024-03-20',
	},
	{
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		mobileNumber: '+1 345-678-9012',
		registerStage: 'Pending',
		date: '2024-03-19',
	},
	{
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		mobileNumber: '+1 456-789-0123',
		registerStage: 'In Progress',
		date: '2024-03-18',
	},
	{
		name: 'Sarah Williams',
		email: 'sarah.w@example.com',
		mobileNumber: '+1 567-890-1234',
		registerStage: 'Completed',
		date: '2024-03-17',
	},
	{
		name: 'Robert Brown',
		email: 'robert.b@example.com',
		mobileNumber: '+1 678-901-2345',
		registerStage: 'Pending',
		date: '2024-03-16',
	},
];

const AiFaceRegistration = ({ link, galleryId }) => {
	const qrRef = useRef(null);
	const {
		galleryInfo: {
			getImagesReadyNotify,
			preRegisteredUsers,
			getPreRegisteredUsers,
			tenantAlbums,
		},
	} = useContext(Context);

	useEffect(() => {
		console.log('===============>galleryId', galleryId);
		console.log('===============>preRegisteredUsers', preRegisteredUsers);
		if (galleryId) {
			getPreRegisteredUsers(galleryId);
		}
	}, []);

	const notifyUser = async () => {
		await getImagesReadyNotify(galleryId);
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
			<Table tableData={preRegisteredUsers} thead={'Register Stage'} />
		</div>
	);
};

export default AiFaceRegistration;

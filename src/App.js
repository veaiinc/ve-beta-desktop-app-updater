import React, { memo, useEffect } from 'react';

function App() {
	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		document.getElementsByTagName('html')[0].classList.add('theme-dark');
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				backgroundColor: '#121212',
				color: '#ffffff',
				fontFamily: 'Arial, sans-serif',
				padding: '20px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					maxWidth: '600px',
					width: '100%',
				}}
			>
				<svg
					style={{
						width: '80px',
						height: '80px',
						margin: '0 auto 30px',
						display: 'block',
					}}
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
						fill="#4CAF50"
					/>
				</svg>

				<h1
					style={{
						fontSize: '32px',
						fontWeight: 'bold',
						marginBottom: '20px',
						color: '#4CAF50',
					}}
				>
					We're Currently Under Maintenance
				</h1>

				<div
					style={{
						backgroundColor: 'rgba(76, 175, 80, 0.1)',
						borderLeft: '4px solid #4CAF50',
						padding: '15px',
						marginBottom: '30px',
						borderRadius: '4px',
					}}
				>
					<p
						style={{
							fontSize: '16px',
							lineHeight: '1.6',
							marginBottom: '15px',
						}}
					>
						We're performing maintenance to improve your experience. Our team is working
						hard to bring the service back online as soon as possible.
					</p>
					<p
						style={{
							fontSize: '16px',
							lineHeight: '1.6',
						}}
					>
						We apologize for any inconvenience this may cause and appreciate your
						patience.
					</p>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '15px',
					}}
				>
					<div
						style={{
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
							padding: '20px',
							borderRadius: '8px',
						}}
					>
						<h2
							style={{
								fontSize: '18px',
								marginBottom: '10px',
								color: '#4CAF50',
							}}
						>
							Expected Downtime
						</h2>
						<p
							style={{
								fontSize: '14px',
								lineHeight: '1.5',
							}}
						>
							Our maintenance is scheduled to be completed by{' '}
							<strong style={{ color: '#4CAF50' }}>
								14 th March 2025, 2:00 AM IST
							</strong>
							. We'll be back online as soon as possible!
						</p>
					</div>

					<div
						style={{
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
							padding: '20px',
							borderRadius: '8px',
						}}
					>
						<h2
							style={{
								fontSize: '18px',
								marginBottom: '10px',
								color: '#4CAF50',
							}}
						>
							Need Assistance?
						</h2>
						<p
							style={{
								fontSize: '14px',
								lineHeight: '1.5',
							}}
						>
							If you have any urgent inquiries, please contact our support team at{' '}
							<a
								href="mailto:support@ve.ai"
								style={{ color: '#4CAF50', textDecoration: 'none' }}
							>
								support@ve.ai
							</a>
						</p>
					</div>
				</div>

				<div
					style={{
						marginTop: '40px',
						fontSize: '14px',
						color: 'rgba(255, 255, 255, 0.6)',
					}}
				>
					<p>Thank you for your understanding and patience.</p>
					<p style={{ marginTop: '10px' }}>© 2025 VE.AI. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}

export default memo(App);

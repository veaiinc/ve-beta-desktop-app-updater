import React, { useState } from 'react';
import { message } from '../../components/globalComponents/CustomToast';

export default function DemoPage() {
	// const { success, warning, error, loading, updateToast } = useToast();
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<button onClick={() => message.success('success message', 3000)}>success</button>
			<button onClick={() => message.warning('warning message')}>warning</button>
			<button onClick={() => message.error('error message')}>error</button>
			<button
				onClick={() => {
					const id = message.loading('loading message');

					setTimeout(() => {
						message.success('operation completed');
					}, 3000);
				}}
			>
				loading
			</button>
			<button onClick={() => message.success('another success')}>another success</button>
		</div>
	);
}

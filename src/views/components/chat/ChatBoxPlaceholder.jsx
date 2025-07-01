import { memo, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/chat/chatboxPlaceholder.scss';

const ChatBoxPlaceholder = ({ chatboxPlaceholders, activePlaceholderIndex }) => {
	return (
		<div className="placeholderWindow">
			<div
				className="placeholderList"
				style={{
					transform: `translateY(-${
						activePlaceholderIndex * 40 + activePlaceholderIndex
					}px)`,
					transition:
						activePlaceholderIndex === 0
							? 'transform 0s ease-in-out'
							: 'transform 0.3s ease-in-out',
				}}
			>
				{chatboxPlaceholders?.map((placeholder, idx) => (
					<p key={idx} className="placeholder">
						{placeholder}
					</p>
				))}
			</div>
		</div>
	);
};

export default memo(ChatBoxPlaceholder);

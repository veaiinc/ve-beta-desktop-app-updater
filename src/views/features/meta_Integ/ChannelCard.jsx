import React from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
const ChannelCard = ({ active, onChannelPress, item, index }) => {
	return (
		<div
			className={`channelCard ${active ? 'active' : ''}`}
			onClick={() => onChannelPress(item, index)}
		>
			<div
				className="imageContainer"
				style={{
					backgroundImage: `url(${item?.displayPicture})`,
				}}
			></div>
			<div className="channelContent">
				<span className="channelName">{item?.userName}</span>
				<div className="newMessageCountContainer">
					<span className="channelSubMessage">{item?.lastMessage}</span>
					{item?.unreadCount ? (
						<div className="countContainer">{item?.unreadCount}</div>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
};

export default ChannelCard;

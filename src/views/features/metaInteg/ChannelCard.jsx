import React from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
import { ReactComponent as Instagram } from '../../../assets/svg/chat/emptyStateInstagram.svg';
import { ReactComponent as Facebook } from '../../../assets/svg/chat/facebook.svg';
import { nameShortner } from '../../../helpers';

const ChannelCard = ({ active, onChannelPress, item, index, activeFilter }) => {
	const iconComponentMapper = {
		instagram: <Instagram />,
		facebook: <Facebook />,
	};

	return (
		<div
			className={`channelCard ${active ? 'active' : ''}`}
			onClick={() => onChannelPress(item, index)}
		>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					// border: '2px solid red',
					alignItems: 'flex-end',
				}}
			>
				{item?.displayPicture?.length ? (
					<div
						className="imageContainer"
						style={{
							backgroundImage: `url(${item?.displayPicture})`,
						}}
					></div>
				) : (
					<div
						style={{
							display: 'flex',
							width: '32px',
							height: '32px',
							borderRadius: '32px',
							backgroundColor: '#fff',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{nameShortner(item?.userName)}
					</div>
				)}
				<span
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						position: 'absolute',
						right: '-7px',
					}}
				>
					{iconComponentMapper?.[activeFilter] || ''}
				</span>
			</div>

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

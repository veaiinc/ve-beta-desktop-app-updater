import React, { memo, useCallback, useMemo, useState } from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
import moment from 'moment';
import { nameShortner } from '../../../helpers';

const MessageCard = ({
	messageItem,
	activeChannel,
	pageInfo,
	activeFilter,
	openUnsendModal,
	index,
}) => {
	const handleDoubleClick = useCallback(() => {
		if (messageItem?.userType === 'user') {
			return;
		}
		openUnsendModal(messageItem, index);
	}, [messageItem, index]);

	return (
		<div
			onDoubleClick={handleDoubleClick}
			className="messageCardContainer"
			style={{
				justifyContent: messageItem?.userType === 'user' ? 'flex-start' : 'flex-end',
			}}
		>
			{messageItem?.userType === 'user' ? (
				<div
					className="imageContainer"
					style={{
						backgroundImage: `url(${activeChannel?.displayPicture})`,
						backgroundColor: activeChannel?.displayPicture?.length
							? 'transparent'
							: 'rgb(255, 255, 255)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{!activeChannel?.displayPicture?.length
						? nameShortner(
								messageItem?.userType === 'user'
									? activeChannel?.userName
									: activeFilter === 'facebook'
									? pageInfo?.pageName
									: pageInfo?.instagramBusinessAccount?.name ||
									  pageInfo?.instagramBusinessAccount?.username,
						  )
						: ''}
				</div>
			) : (
				''
			)}

			<div className="messageDetailsContainer">
				<div
					className="userDetails"
					style={{
						justifyContent:
							messageItem?.userType === 'user' ? 'flex-start' : 'flex-end',
					}}
				>
					<span
						className="userName"
						style={{
							textAlign: messageItem?.userType === 'user' ? 'left' : 'right',
						}}
					>
						{messageItem?.userType === 'user'
							? activeChannel?.userName
							: activeFilter === 'facebook'
							? pageInfo?.pageName
							: pageInfo?.instagramBusinessAccount?.name ||
							  pageInfo?.instagramBusinessAccount?.username}
					</span>
					<span className="timing">
						{moment.unix(`${messageItem?.createdAt}`).format('DD MMM hh:mm A')}
					</span>
				</div>
				<div
					className="messageCard"
					style={{
						backgroundColor: messageItem?.userType === 'user' ? '#1B1B1B' : '#6055EC',
						alignSelf: messageItem?.userType === 'user' ? 'flex-start' : 'flex-end',
						borderBottomLeftRadius: messageItem?.userType === 'user' ? 0 : 13,
						borderBottomRightRadius: messageItem?.userType === 'user' ? 13 : 0,
						cursor: 'pointer',
					}}
				>
					{messageItem?.messageText}
				</div>
			</div>

			{messageItem?.userType !== 'user' ? (
				<div
					className="imageContainer"
					style={{
						backgroundImage: `url(${
							activeFilter === 'facebook'
								? pageInfo?.displayPicture
								: pageInfo?.instagramBusinessAccount?.profile_picture_url
						})`,
						backgroundColor: activeChannel?.displayPicture?.length
							? 'transparent'
							: 'rgb(255, 255, 255)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{/* {!pageInfo?.instagramBusinessAccount?.profile_picture_url?.length &&
						!pageInfo?.displayPicture?.length
							? nameShortner(
									activeFilter === 'facebook'
										? pageInfo?.pageName
										: pageInfo?.instagramBusinessAccount?.name ||
												pageInfo?.instagramBusinessAccount?.username,
							  )
							: ''} */}

					{activeFilter === 'facebook' && !pageInfo?.displayPicture?.length
						? nameShortner(pageInfo?.pageName)
						: nameShortner(
								pageInfo?.instagramBusinessAccount?.name ||
									pageInfo?.instagramBusinessAccount?.username,
						  )}
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default memo(MessageCard);

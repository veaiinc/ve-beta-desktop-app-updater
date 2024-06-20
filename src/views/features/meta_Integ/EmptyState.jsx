import React, { memo } from 'react';
import '../../../assets/scss/chat/empty.scss';
import { ReactComponent as Instagram } from '../../../assets/svg/chat/emptyStateInstagram.svg';
import { ReactComponent as EmptySvg } from '../../../assets/svg/chat/EmptyState.svg';
import { ReactComponent as StarSvg } from '../../../assets/svg/chat/star.svg';
import { ReactComponent as SubmitSvg } from '../../../assets/svg/chat/submitBtn.svg';
const NotIntegratedComponent = ({ type }) => {
	return (
		<>
			<EmptySvg />
			<div className="platformMainLabel">
				<span className="platformIntegrationMessage">{`${type} not Integrated yet`}</span>
				<span className="platformSuppportingText">
					You need to connect your Meta Account to use this feature
				</span>
			</div>
			<div className="integrateBtn">Integrate Meta Account</div>

			<span className="labeData">
				If you need assistance, contact our support team at support@ve.co Here’s to doing
				what you love! Let’s do this.
			</span>
		</>
	);
};

const EmptyChannelList = () => {
	return (
		<>
			<EmptySvg />
			<div className="platformMainLabel">
				<span className="platformIntegrationMessage">Start a Conversation</span>
				<span className="platformSuppportingText">
					Your inbox is empty, but don’t worry! Your messages would show up here soon
				</span>
			</div>
		</>
	);
};

const EmptyState = ({ type }) => {
	const channels = [{}, {}, {}, {}, {}, {}];

	const typeMapper = {
		facebookNotIntegrated: <NotIntegratedComponent type="Facebook" />,
		instagramNotIntegrated: <NotIntegratedComponent type="Instagram" />,
		emptyChannelList: <EmptyChannelList />,
	};

	return (
		<div className="emptyStateContainer">
			<div className="channelList">
				{channels?.map((ele, index) => (
					<div className="emptyStateCard">
						<div className="iconContainer">
							<div className="circularFrame"></div>
							<span className="platformIcon">
								<Instagram />
							</span>
						</div>

						<div className="emptyBarsContainer">
							<div className="broadBar"></div>
							<div className="thinBar"></div>
						</div>
					</div>
				))}
			</div>
			<div className="divider"></div>
			<div className="MessageList">
				<div className="header">
					<div className="emptyStateCard">
						<div className="iconContainer">
							<div className="circularFrame"></div>
							<span className="platformIcon">
								<Instagram />
							</span>
						</div>

						<div className="emptyBarsContainer">
							<div className="broadBar"></div>
							<div className="thinBar"></div>
						</div>
					</div>
				</div>
				<div className="emptyStateData">
					{typeMapper?.[type] || <NotIntegratedComponent type="Meta" />}
				</div>
				<div className="inputContainer">
					<StarSvg />
					<span className="placeHolder">Type your message here</span>
					<SubmitSvg />
				</div>
			</div>
		</div>
	);
};

export default memo(EmptyState);

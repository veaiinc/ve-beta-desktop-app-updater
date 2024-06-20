import React from 'react';
import '../../../assets/scss/chat/empty.scss';
import { ReactComponent as Instagram } from '../../../assets/svg/chat/emptyStateInstagram.svg';

const EmptyState = () => {
	const channels = [{}, {}, {}, {}, {}, {}];

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
			</div>
		</div>
	);
};

export default EmptyState;

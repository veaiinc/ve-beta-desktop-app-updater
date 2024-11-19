import React, { memo } from 'react';
import { ReactComponent as Sparkel } from '../../../assets/svg/activity/sparkel.svg';

const ChatSession = () => {
	return (
		<div className="chatParentContainer">
			<div className="chatContainer">
				<div className="chatMessage chatMessageAi">
					<div className="chatMessageHeader">
						<div className="chatMessager">
							<span className="chatMessageIcon">
								<Sparkel />
							</span>
							<span className="chatMessageUsername">Optimus</span>
						</div>
						<span className="chatMessageTimestamp">Today 19:30 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByAi">
							Hi Avinash, I am here to assist you with your business inquires. Please
							specify your needs and I will provide the necessary information.
						</p>
					</div>
				</div>

				<div className="chatMessage chatMessageUser">
					<div className="chatMessageHeader">
						<span className="chatMessageTimestamp">Today 19:30 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByUser">Summarize the page</p>
					</div>
				</div>

				<div className="chatMessage chatMessageAi">
					<div className="chatMessageHeader">
						<div className="chatMessager">
							<span className="chatMessageIcon">
								<Sparkel />
							</span>
							<span className="chatMessageUsername">Optimus</span>
						</div>
						<span className="chatMessageTimestamp">Today 19:31 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByAi">
							Hey John Michael Your Total Package is $2,00,000 Your additional
							services are Drone - $300 LED wall - $240
						</p>
					</div>
				</div>

				<div className="chatMessage chatMessageUser">
					<div className="chatMessageHeader">
						<span className="chatMessageTimestamp">Today 19:30 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByUser">
							Remove the additional services and give me the quotation...
						</p>
					</div>
				</div>
				<div className="chatMessage chatMessageAi">
					<div className="chatMessageHeader">
						<div className="chatMessager">
							<span className="chatMessageIcon">
								<Sparkel />
							</span>
							<span className="chatMessageUsername">Optimus</span>
						</div>
						<span className="chatMessageTimestamp">Today 19:30 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByAi">
							Hi Avinash, I am here to assist you with your business inquires. Please
							specify your needs and I will provide the necessary information.
						</p>
					</div>
				</div>

				<div className="chatMessage chatMessageUser">
					<div className="chatMessageHeader">
						<span className="chatMessageTimestamp">Today 19:30 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByUser">Summarize the page</p>
					</div>
				</div>

				<div className="chatMessage chatMessageAi">
					<div className="chatMessageHeader">
						<div className="chatMessager">
							<span className="chatMessageIcon">
								<Sparkel />
							</span>
							<span className="chatMessageUsername">Optimus</span>
						</div>
						<span className="chatMessageTimestamp">Today 19:31 pm</span>
					</div>
					<div className="chatMessageBody">
						<p className="textByAi">
							Hey John Michael Your Total Package is $2,00,000 Your additional
							services are Drone - $300 LED wall - $240
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ChatSession);

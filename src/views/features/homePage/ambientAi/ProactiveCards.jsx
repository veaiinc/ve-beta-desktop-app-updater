import { memo } from 'react';
import '../../../../assets/scss/home_page/ambientAi/proactiveCards.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';

const positionClassMap = {
	0: 'selected',
	1: 'right-1',
	2: 'right-2',
	3: 'right-3',
	'-1': 'left-1',
	'-2': 'left-2',
	'-3': 'left-3',
};

const PriorityLevel = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};

const ProactiveCards = ({ cards = [], selectedOption = null, handleCardClick = null }) => {
	return selectedOption === 'onboarding'
		? cards?.map((card, index) => {
				if (card?.position === null) return null;
				const classList = ['card', positionClassMap[card?.position]];
				return (
					<div
						key={index}
						className={classList?.join(' ')}
						onClick={() => handleCardClick?.(card, index)}
						style={{
							background:
								classList?.[1] === 'selected'
									? 'var(--popup)'
									: 'var(--background-color)',
							overflow: 'hidden',
						}}
					>
						<div
							className="onboarding__header"
							style={{
								justifyContent: !card?.btnText ? 'space-between' : 'flex-start',
							}}
						>
							<div className="onboarding-title">
								{card?.title}
								<br />
								<span
									style={{
										color:
											classList?.[1] === 'selected'
												? 'var(--primary-button)'
												: 'var(--secondary-font)',
									}}
								>
									{card?.subTitle}
								</span>
							</div>

							<div
								className={`onboarding-description ${
									classList?.[1] === 'selected' ? 'showDescription' : ''
								}`}
							>
								{card?.description}
							</div>
						</div>
						{classList?.[1] === 'selected' && card?.btnText && (
							<div className="onboarding-footer">
								{card?.btnText}
								<ChevronRightThinSvg />
							</div>
						)}
					</div>
				);
		  })
		: cards?.map((card, index) => {
				if (card?.position === null) return null;
				const classList = ['card', positionClassMap[card?.position]];
				return (
					<div
						key={index}
						className={classList?.join(' ')}
						onClick={() => handleCardClick?.(card, index)}
						style={{
							background:
								classList?.[1] === 'selected'
									? 'var(--popup)'
									: 'var(--background-color)',
						}}
					>
						{classList?.[1] === 'selected' && card?.read === false && (
							<div className="unread-indicator" />
						)}
						<div className="header">
							<div className="header__card-title">{card?.title}</div>
							<div
								className={`header__card-description ${
									classList?.[1] === 'selected' ||
									card?.insight_type === 'actions'
										? 'showDescription'
										: ''
								}`}
							>
								{card?.description || card?.crux}
							</div>
						</div>
						{classList?.[1] === 'selected' && (
							<div className="footer">
								<div className="module-type">{card?.moduleType}</div>
								<div className="module-priority">
									<span
										style={{
											backgroundColor: PriorityLevel[card?.priority],
										}}
									></span>
									<div className="module-priority-text">
										<div>{card?.priority}</div>
										{card?.priority && card?.updatedAt && (
											<div
												style={{
													color: 'var(--secondary-font)',
												}}
											>
												|
											</div>
										)}
										<Tooltip
											title={dayjs(card?.updatedAt * 1000).format(
												'MMMM D, YYYY h:mm A',
											)}
										>
											<div>{dayjs(card?.updatedAt * 1000)?.fromNow()}</div>
										</Tooltip>
									</div>
								</div>
							</div>
						)}
					</div>
				);
		  });
};

export default memo(ProactiveCards);

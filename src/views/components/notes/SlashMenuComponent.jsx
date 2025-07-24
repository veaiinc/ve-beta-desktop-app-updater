import { memo } from 'react';
import s from '../../../assets/scss/notes/slashMenuComponent.module.scss';

function groupByGroupNameWithIndex(items) {
	const result = {};

	items.forEach((item, index) => {
		const group = item.group;
		const itemWithIndex = { ...item, originalIndex: index };

		if (!result[group]) {
			result[group] = [];
		}

		result[group].push(itemWithIndex);
	});

	return result;
}

const SlashMenuComponent = ({ items, selectedIndex }) => {
	const {
		Headings: headings,
		'Basic blocks': basicBlocks,
		Advanced: advanced,
		Media: media,
		Others: others,
	} = groupByGroupNameWithIndex(items);

	return (
		<div className={s.slashMenuComponent}>
			{headings?.length > 0 && (
				<>
					<div className={s.itemWrapper}>
						<div className={s.groupName}>Headings</div>
						<div className={s.itemsList}>
							{headings.map(
								({ icon, title, badge, key, originalIndex, onItemClick }) => (
									<div
										key={key}
										className={`${s.item} ${
											selectedIndex === originalIndex ? s.selected : ''
										}`}
										onClick={onItemClick}
									>
										<div className={s.itemIcon}>{icon}</div>
										<div className={s.itemTitle}>{title}</div>
										<div className={s.itemBadge}>
											{badge?.split('-').map((item, index) => (
												<span className={s.badgeKey} key={index}>
													{item}
												</span>
											))}
										</div>
									</div>
								),
							)}
						</div>
					</div>
					<div className={s.divider}></div>
				</>
			)}

			{basicBlocks?.length > 0 && (
				<>
					<div className={s.itemWrapper}>
						<div className={s.groupName}>Basic blocks</div>
						<div className={s.itemsList}>
							{basicBlocks.map(
								({ icon, title, badge, key, originalIndex, onItemClick }) => (
									<div
										key={key}
										className={`${s.item} ${
											selectedIndex === originalIndex ? s.selected : ''
										}`}
										onClick={onItemClick}
									>
										<div className={s.itemIcon}>{icon}</div>
										<div className={s.itemTitle}>{title}</div>
										<div className={s.itemBadge}>
											{badge?.split('-').map((item, index) => (
												<span className={s.badgeKey} key={index}>
													{item}
												</span>
											))}
										</div>
									</div>
								),
							)}
						</div>
					</div>
					<div className={s.divider}></div>
				</>
			)}

			{advanced?.length > 0 && (
				<>
					<div className={s.itemWrapper}>
						<div className={s.groupName}>Advanced</div>
						<div className={s.itemsList}>
							{advanced.map(
								({ icon, title, badge, key, originalIndex, onItemClick }) => (
									<div
										key={key}
										className={`${s.item} ${
											selectedIndex === originalIndex ? s.selected : ''
										}`}
										onClick={onItemClick}
									>
										<div className={s.itemIcon}>{icon}</div>
										<div className={s.itemTitle}>{title}</div>
										<div className={s.itemBadge}>
											{badge?.split('-').map((item, index) => (
												<span className={s.badgeKey} key={index}>
													{item}
												</span>
											))}
										</div>
									</div>
								),
							)}
						</div>
					</div>
					<div className={s.divider}></div>
				</>
			)}

			{media?.length > 0 && (
				<>
					<div className={s.itemWrapper}>
						<div className={s.groupName}>Media</div>
						<div className={s.itemsList}>
							{media.map(
								({ icon, title, badge, key, originalIndex, onItemClick }) => (
									<div
										key={key}
										className={`${s.item} ${
											selectedIndex === originalIndex ? s.selected : ''
										}`}
										onClick={onItemClick}
									>
										<div className={s.itemIcon}>{icon}</div>
										<div className={s.itemTitle}>{title}</div>
										<div className={s.itemBadge}>
											{badge?.split('-').map((item, index) => (
												<span className={s.badgeKey} key={index}>
													{item}
												</span>
											))}
										</div>
									</div>
								),
							)}
						</div>
					</div>
					<div className={s.divider}></div>
				</>
			)}

			{others?.length > 0 && (
				<div className={s.itemWrapper}>
					<div className={s.groupName}>Others</div>
					<div className={s.itemsList}>
						{others.map(({ icon, title, badge, key, originalIndex, onItemClick }) => (
							<div
								key={key}
								className={`${s.item} ${
									selectedIndex === originalIndex ? s.selected : ''
								}`}
								onClick={onItemClick}
							>
								<div className={s.itemIcon}>{icon}</div>
								<div className={s.itemTitle}>{title}</div>
								<div className={s.itemBadge}>
									{badge?.split('-').map((item, index) => (
										<span className={s.badgeKey} key={index}>
											{item}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(SlashMenuComponent);

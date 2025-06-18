import { memo, useState } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/groupToggler.module.scss';
import { ReactComponent as ChevronSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

const GroupToggler = ({ children, groupData }) => {
	const [info, setInfo] = useState({
		isOpen: true,
	});
	const handleToggle = () => {
		setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));
	};
	return (
		<div className={s.groupToggler}>
			<div className={s.groupTogglerHeader}>
				<button className={s.groupTogglerButton} onClick={handleToggle}>
					<ChevronSvg
						className={`${s.groupTogglerIcon} ${
							info?.isOpen ? s.groupTogglerIconOpen : ''
						}`}
					/>
				</button>
				<span className={s.groupTogglerContent}>{groupData?.label || 'No value'}</span>
			</div>
			{info?.isOpen && children}
		</div>
	);
};

export default memo(GroupToggler);

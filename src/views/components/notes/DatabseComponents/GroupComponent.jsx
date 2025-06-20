import { Tooltip } from 'antd';
import { memo, useContext, useState } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/groupComponent.module.scss';
import Context from '../../../../context/context';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';

const GroupComponent = ({ fields, view, databaseId, blockId }) => {
	const {
		notes: { updateViewGroup },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: false,
	});

	const handleUpdateViewGroup = async (fieldId) => {
		if (info?.loading || view?.groupBy?.fieldId === fieldId) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		await updateViewGroup(
			{
				pageId: view?.pageId,
				databaseViewId: view?._id,
				databaseId: databaseId,
				input: {
					fieldId,
				},
			},
			blockId,
		);
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	return (
		<Tooltip
			title={
				<div className={s.groupComponentDropdown}>
					<div className={s.groupComponentDropdownHeader}>Group by</div>
					<div className={s.groupComponentDropdownBody}>
						<div
							className={s.groupComponentDropdownBodyOptions}
							onClick={() => handleUpdateViewGroup('none')}
						>
							<div className={s.groupComponentDropdownBodyOptionsLabel}>None</div>
							{view?.groupBy?.fieldId === null && <Tick />}
						</div>
						{fields?.map((field) => (
							<div
								key={field?._id}
								className={s.groupComponentDropdownBodyOptions}
								onClick={() => handleUpdateViewGroup(field?._id)}
							>
								<div className={s.groupComponentDropdownBodyOptionsLabel}>
									{field?.name}
								</div>
								{view?.groupBy?.fieldId === field?._id && <Tick />}
							</div>
						))}
					</div>
				</div>
			}
			placement="bottomLeft"
			overlayClassName="status-dropdown"
			color="transparent"
			trigger={['click']}
			onClick={(e) => {
				e?.stopPropagation();
			}}
		>
			<button>Group</button>
		</Tooltip>
	);
};

export default memo(GroupComponent);

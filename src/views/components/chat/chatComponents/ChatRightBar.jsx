import { memo, useMemo, lazy, Suspense } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/chatRightBar.module.scss';
const CitationsModal = lazy(() => import('../../modalsV2/chat/CitationsModal'));

const ChatRightBar = ({ activeRightBar, handleRightBarToggle, handleCloseCitationsModal }) => {
	const componentMapper = useMemo(
		() => ({
			citations: (
				<div className={s.citationsWrapper}>
					<Suspense fallback={'Loading...'}>
						<CitationsModal closeModal={handleCloseCitationsModal} />
					</Suspense>
				</div>
			),
		}),
		[handleRightBarToggle, handleCloseCitationsModal],
	);

	return <div className={s.chatRightBar}>{componentMapper[activeRightBar] ?? ''}</div>;
};

export default memo(ChatRightBar);

import { memo, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Context from '../../../context/context';
import ProactiveSuggestions from '../homePage/ProactiveSuggestions';
import '../../../assets/scss/ambientAi/ambientAi.scss';

const AmbientAi = () => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const previousSelectedOptionRef = useRef(null);
	const [info, setInfo] = useState({
		selectedOption: '',
		aiSuggestionsModalOpen: false,
	});

	useEffect(() => {
		if (info?.aiSuggestionsModalOpen) {
			updateStateValues({
				leftSidebarState: 'close',
			});
		}
	}, [info?.aiSuggestionsModalOpen]);

	const handleModalOpen = useCallback((value) => {
		setInfo((prev) => {
			if (prev?.aiSuggestionsModalOpen === value) return prev;
			return {
				...prev,
				aiSuggestionsModalOpen: value,
			};
		});
	}, []);

	return (
		<div className="ambient-ai-wrapper">
			<div className={`ambient-ai-container ${info?.aiSuggestionsModalOpen ? 'active' : ''}`}>
				<div className="ambient-ai-container-content">
					<ProactiveSuggestions
						option={info?.selectedOption}
						previousOption={previousSelectedOptionRef.current}
						handleModalOpen={handleModalOpen}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(AmbientAi);

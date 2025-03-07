import { Drawer } from 'antd';
import '../../../../assets/scss/chat/modal/citationsModal.scss';
import { ReactComponent as CitationCloseIcon } from '../../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import { CitationsTooltip } from './CitationsTooltip';

const CitationsModal = ({ closeModal, modalIsOpen }) => {
	const {
		templates: { citations },
	} = useContext(Context);

	const [info, setInfo] = useState({
		citations: null,
	});

	useEffect(() => {
		if (citations) {
			const aggregatedCitations = aggregateCitations(citations);
			setInfo((prev) => ({
				...prev,
				citations: aggregatedCitations,
			}));
		}
	}, [citations]);

	const aggregateCitations = (citations) => {
		const grouped = {};

		citations.forEach((citation) => {
			const { source, id } = citation;
			const baseSource = source ? source.split('::')[0] : `NULL_SOURCE_${id}`;

			if (!grouped[baseSource]) {
				grouped[baseSource] = {
					...citation,
					commonIds: [],
				};
			}

			grouped[baseSource].commonIds.push(id);
		});

		return Object.values(grouped);
	};

	return (
		<Drawer
			open={modalIsOpen}
			rootClassName="citations-modal"
			width={400}
			mask={false}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="citations-container">
				<div className="header">
					<div className="left-text">Sources</div>
					<div className="close-modal-icon" onClick={closeModal}>
						<CitationCloseIcon />
					</div>
				</div>
				<div className="sources">
					{info?.citations?.length > 0 ? (
						info?.citations?.map((citation, index) => {
							const name = citation?.['name'] || '';
							const type = citation?.type || '';
							const link = citation?.[type] || '';
							return (
								<div className="source-container">
									<div className="image"></div>
									<div className="info">
										<a
											className="link"
											href={link}
											target="_blank"
											rel="noreferrer"
										>
											{name}
										</a>
										<div className="orders-container">
											{citation?.commonIds?.map((id) => {
												return (
													<CitationsTooltip
														citationId={id}
														citations={citations}
														placement={'bottomRight'}
													/>
												);
											})}
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div style={{ color: '#f2f2f3', textAlign: 'center' }}>No citations</div>
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default CitationsModal;

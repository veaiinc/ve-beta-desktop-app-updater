import { CitationsTooltip } from '../views/components/modalsV2/chat/CitationsTooltip';
import Service from '../services/index';

export const handleDeepSearchChainOfThought = (chainOfThought) => {
	const cot = [];

	for (let i = 0; i < chainOfThought?.length; i++) {
		const data = chainOfThought?.[i] || {};
		if (data?.step) {
			cot?.push({ step: data?.step, readings: data?.reading || [] });
		}

		// if (data?.memory_thinking) {
		// 	cot?.push({ step: data?.memory_thinking });
		// }
	}

	return { cot };
};

export const updateCitationIdsWithCitations = (input = '', citations = null) => {
	const regex = /\[C\d+\]/g;
	const parts = input?.split(regex);
	const matches = input?.match(regex) || [];
	const result = [];

	parts?.forEach((part, index) => {
		result?.push(<span key={`text-${index}`}>{part}</span>);

		const match = matches[index];
		if (match) {
			const id = match?.slice(1, -1);
			result?.push(<CitationsTooltip key={index} citationId={id} citations={citations} />);
		}
	});

	return result;
};

export const handleDeepResearchChainOfThought = (chainOfThought) => {
	let cot = [],
		sections = [],
		sections_refined = [];

	for (let i = 0; i < chainOfThought?.length; i++) {
		const data = chainOfThought?.[i] || {};

		if (data?.responded) {
			cot?.push({ step: data?.responded });
		}

		// if (data?.memory_thinking) {
		// 	cot?.push({ step: data?.memory_thinking });
		// }

		if (data?.intermediate_step) {
			let last_step = { ...(cot?.[cot?.length - 1] || {}) };
			last_step = {
				...(last_step || {}),
				...(data?.intermediate_step || {}),
			};
			cot[cot?.length - 1] = last_step;
		}

		if (data?.step) {
			cot?.push({ step: data?.step, citations: data?.citations || [] });
		}

		if (data?.sub_queries) {
			const sub_queries = (data?.sub_queries || [])?.map((subQuery) => ({
				sub_query: subQuery,
			}));
			sections?.push({
				section: data?.section,
				sub_queries,
				section_id: data?.section_id,
			});
		}

		if (data?.reading && data?.reading?.sub_query && data?.section_id) {
			sections = sections?.map((section) => {
				if (section?.section_id === data?.section_id) {
					let sub_queries = section?.sub_queries?.map((subQuery) => {
						if (subQuery?.sub_query === data?.reading?.sub_query) {
							const readings = [...(subQuery?.readings || [])];
							readings?.push({ reading: data?.reading });
							return {
								...subQuery,
								readings,
							};
						}
						return subQuery;
					});
					return {
						...section,
						sub_queries,
					};
				}
				return section;
			});
		}

		if (data?.refined_sub_queries) {
			const refined_sub_queries = (data?.refined_sub_queries || [])?.map((subQuery) => ({
				refined_sub_query: subQuery,
			}));
			sections_refined?.push({
				section: data?.section,
				refined_sub_queries,
				section_id: data?.section_id,
			});
		}

		if (data?.reading && data?.reading?.refined_sub_query && data?.section_id) {
			sections_refined = sections_refined?.map((section) => {
				if (section?.section_id === data?.section_id) {
					let refined_sub_queries = section?.refined_sub_queries?.map((subQuery) => {
						if (subQuery?.refined_sub_query === data?.reading?.refined_sub_query) {
							const readings = [...(subQuery?.readings || [])];
							readings?.push({ reading: data?.reading });
							return {
								...subQuery,
								readings,
							};
						}
						return subQuery;
					});
					return {
						...section,
						refined_sub_queries,
					};
				}
				return section;
			});
		}

		if (data?.compiling && data?.section_id) {
			sections = sections?.map((section) => {
				if (section?.section_id === data?.section_id) {
					return {
						...section,
						compiling: data?.compiling,
					};
				}
				return section;
			});
			sections_refined = sections_refined?.map((section) => {
				if (section?.section_id === data?.section_id) {
					return {
						...section,
						compiling: data?.compiling,
					};
				}
				return section;
			});
		}
	}

	return { cot, sections, sections_refined };
};

export const handleCombinedChainOfThought = (chainOfThought) => {
	const thoughts = [],
		deepSearches = {},
		deepResearches = {},
		searchIdMapper = {};

	for (let i = 0; i < chainOfThought?.length; i++) {
		const data = chainOfThought?.[i] || {};
		const { search_id, processing, thought } = data || {};

		if (typeof data === 'string') {
			thoughts?.push({
				thought: data,
			});
		}

		if (thought) {
			thoughts?.push({ thought: thought?.step || thought });
		}

		if (processing === 'Deep Search') {
			searchIdMapper[search_id] = 'deepSearch';
		}

		if (processing === 'Deep Research') {
			searchIdMapper[search_id] = 'deepResearch';
		}

		if (search_id) {
			if (searchIdMapper[search_id] === 'deepSearch') {
				if (deepSearches[search_id]) {
					deepSearches[search_id]?.chainOfThought?.push(data);
				} else {
					deepSearches[search_id] = {
						order: i,
						chainOfThought: [data],
					};
				}
			}

			if (searchIdMapper[search_id] === 'deepResearch') {
				if (deepResearches[search_id]) {
					deepResearches[search_id]?.chainOfThought?.push(data);
				} else {
					deepResearches[search_id] = {
						order: i,
						chainOfThought: [data],
					};
				}
			}
		}
	}

	let deepSearchesArray = Object?.values(deepSearches);
	let deepResearchesArray = Object?.values(deepResearches);

	deepSearchesArray = deepSearchesArray?.map((deepSearch) => {
		const chainOfThought = deepSearch?.chainOfThought || [];
		return handleDeepSearchChainOfThought(chainOfThought);
	});

	deepResearchesArray = deepResearchesArray?.map((deepResearch) => {
		const chainOfThought = deepResearch?.chainOfThought || [];
		return handleDeepResearchChainOfThought(chainOfThought);
	});

	return {
		thoughts,
		deepSearches: deepSearchesArray,
		deepResearches: deepResearchesArray,
		hasChainOfThought: chainOfThought?.length > 0,
	};
};

const activePollTimeouts = {};

export const getBrowserUrls = async (sessionId, handleGlobalChatMessages) => {
	const workspaceId = localStorage.getItem('workspaceId');
	const usertoken = localStorage.getItem('usertoken');

	if (activePollTimeouts[sessionId]) {
		clearTimeout(activePollTimeouts[sessionId]);
		delete activePollTimeouts[sessionId];
	}

	let count = 0;
	const MAX_COUNT = 10;
	const INTERVAL_MS = 3000;

	const poll = async () => {
		if (count >= MAX_COUNT) {
			delete activePollTimeouts[sessionId];
			return;
		}

		try {
			const response = await Service.fetchGet(
				`/api/browser/live-stream/status/${workspaceId}/${sessionId}`,
				usertoken,
				'browser_api',
			);

			if (response?.[0] && response?.[1]?.success === true) {
				handleGlobalChatMessages({
					sessionId: sessionId,
					browserData: response?.[1],
					updateExtraInfo: true,
				});
				delete activePollTimeouts[sessionId];
				return;
			} else if (response?.[1]?.activeTabIndex === 0 || response?.[1]?.success === false) {
				console.log('making api call to get browser urls');
			} else {
				delete activePollTimeouts[sessionId];
				return;
			}
		} catch (error) {
			console.error('error==>getBrowserUrls', error);
			delete activePollTimeouts[sessionId];
			return;
		}

		count++;
		const timeoutId = setTimeout(poll, INTERVAL_MS);
		activePollTimeouts[sessionId] = timeoutId;
	};

	poll();
};

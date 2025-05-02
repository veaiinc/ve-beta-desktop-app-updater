export const handleDeepSearchChainOfThought = (chainOfThought) => {
	const cot = [],
		cot_refined = [];
	let initial_answer = {};

	for (let i = 0; i < chainOfThought?.length; i++) {
		const data = chainOfThought?.[i] || {};

		if (data?.sub_query) {
			cot.push({
				sub_query: data?.sub_query,
				searching: data?.searching,
				readings: data?.reading,
			});
		}

		if (data?.initial_answer) {
			initial_answer = data;
		}

		if (data?.refined_sub_query) {
			cot_refined.push({
				sub_query: data?.refined_sub_query,
				searching: data?.searching,
				readings: data?.reading,
			});
		}
	}

	return { cot, cot_refined, initial_answer };
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

		if (thought) {
			thoughts?.push(data);
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
		const { chainOfThought } = deepSearch?.chainOfThought || [];
		return handleDeepSearchChainOfThought(chainOfThought);
	});

	deepResearchesArray = deepResearchesArray?.map((deepResearch) => {
		const { chainOfThought } = deepResearch?.chainOfThought || [];
		return handleDeepResearchChainOfThought(chainOfThought);
	});

	return { thoughts, deepSearches: deepSearchesArray, deepResearches: deepResearchesArray };
};

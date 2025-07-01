import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
	handleDeepSearchChainOfThought,
	handleDeepResearchChainOfThought,
	updateCitationIdsWithCitations,
	handleCombinedChainOfThought,
} from '../../helpers/chatHelpers';
import { render, screen } from '@testing-library/react';
// Mock CitationsTooltip to simplify tests
vi.mock('../../views/components/modalsV2/chat/CitationsTooltip', () => ({
	CitationsTooltip: ({ citationId }) => (
		<div data-testid={`citation-${citationId}`}>{citationId}</div>
	),
}));

describe('chatHelpers utilities', () => {
	describe('handleDeepSearchChainOfThought', () => {
		// Test parsing steps and memory thinking into structured format
		it('parses steps and memory thinking into cot array', () => {
			const chain = [{ step: 'First', reading: 'A' }, { memory_thinking: 'Remember' }];
			const result = handleDeepSearchChainOfThought(chain);
			expect(result).toEqual({
				cot: [{ step: 'First', readings: 'A' }, { step: 'Remember' }],
			});
		});

		// Test handling empty input
		it('returns empty cot when input is empty', () => {
			expect(handleDeepSearchChainOfThought([])).toEqual({ cot: [] });
		});
	});

	describe('handleDeepResearchChainOfThought', () => {
		// Test building chain of thought with intermediate steps
		it('builds cot with intermediate steps', () => {
			const chain = [
				{ responded: 'Resp' },
				{ memory_thinking: 'Think' },
				{ intermediate_step: { extra: true } },
				{ step: 'Final', citations: ['C1'] },
			];

			const result = handleDeepResearchChainOfThought(chain);
			expect(result.cot).toEqual([
				{ step: 'Resp' },
				{ step: 'Think', extra: true },
				{ step: 'Final', citations: ['C1'] },
			]);
			expect(result.sections).toEqual([]);
			expect(result.sections_refined).toEqual([]);
		});
	});

	describe('updateCitationIdsWithCitations', () => {
		// Test converting citation placeholders to React components
		it('inserts citation tooltip components for ids', () => {
			const citations = [{ id: 'C1', snippet: 's' }];
			const nodes = updateCitationIdsWithCitations('Hello [C1] World', citations);
			render(<>{nodes}</>);
			expect(screen.getByText('Hello')).toBeInTheDocument();
			expect(screen.getByTestId('citation-C1')).toBeInTheDocument();
			expect(screen.getByText('World')).toBeInTheDocument();
		});
	});

	describe('handleCombinedChainOfThought', () => {
		// Test grouping different types of chain data
		it('groups deep searches and researches with thoughts', () => {
			const chain = [
				'Hi',
				{ search_id: '1', processing: 'Deep Search', step: 'S1' },
				{ search_id: '1', step: 'S2' },
				{ search_id: '2', processing: 'Deep Research', step: 'R1' },
				{ search_id: '2', step: 'R2' },
				{ thought: { step: 'Bye' } },
			];

			const result = handleCombinedChainOfThought(chain);
			expect(result.thoughts).toEqual([{ thought: 'Hi' }, { thought: 'Bye' }]);
			expect(result.deepSearches[0].cot.length).toBe(2);
			expect(result.deepResearches[0].cot.length).toBe(2);
			expect(result.hasChainOfThought).toBe(true);
		});

		// Test handling empty input
		it('handles empty input', () => {
			const result = handleCombinedChainOfThought([]);
			expect(result).toEqual({
				thoughts: [],
				deepSearches: [],
				deepResearches: [],
				hasChainOfThought: false,
			});
		});
	});
});

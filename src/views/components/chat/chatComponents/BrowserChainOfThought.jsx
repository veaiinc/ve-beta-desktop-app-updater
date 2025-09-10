import { memo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browserChainOfThought.module.scss';
import BrowserPlan from './BrowserPlan';
import BrowserTools from './BrowserTools';

const BrowserChainOfThought = ({ chainOfThought = {} }) => {
	return (
		<div className={s.browserChainOfThoughtContainer}>
			{chainOfThought?.browserPlan && (
				<BrowserPlan browserPlan={chainOfThought?.browserPlan} />
			)}
			{chainOfThought?.browserTools?.length > 0 && (
				<BrowserTools data={chainOfThought?.browserTools} />
			)}
		</div>
	);
};

export default memo(BrowserChainOfThought);

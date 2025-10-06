import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import BlockPage from '../views/features/landingScreen/blockPage/BlockPage';
import AuthWrapper from '../views/layouts/authWrapper';
import SuspenseFallback from '../views/components/globalComponents/SuspenseFallback';

// Lazy load the pricing page
const PricingPage = lazy(() => import('../views/features/pricingPlans/pricingPage'));

const suspendedRoute = [
	// Allow access to pricing page for suspended users
	{
		path: '/settings/pricing',
		element: (
			<Suspense fallback={<SuspenseFallback />}>
				<AuthWrapper title={'Pricing'}>
					<PricingPage />
				</AuthWrapper>
			</Suspense>
		),
	},
	// Block all other routes for suspended users
	{
		path: '*',
		element: (
			<AuthWrapper>
				<BlockPage />
			</AuthWrapper>
		),
	},
];

export default suspendedRoute;

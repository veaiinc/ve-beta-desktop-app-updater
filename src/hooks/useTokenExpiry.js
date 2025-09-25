import { useEffect, useRef, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import Context from '../context/context';
import { fetchDomainName } from '../helpers';

const useTokenExpiry = () => {
	const timerRef = useRef(null);

	const [accessTokenExpiry, setAccessTokenExpiry] = useState(
		localStorage.getItem('accessTokenExpiry') || Cookies.get('accessTokenExpiry'),
	);

	const {
		authInfo: { getNewAccessToken },
	} = useContext(Context);

	useEffect(() => {
		if (timerRef.current) clearTimeout(timerRef.current); // clear existing timers (if any)
		const triggerAt = (accessTokenExpiry - 60) * 1000; // 60s before access token expires
		const delay = Math.max(triggerAt - Date.now(), 0);

		timerRef.current = setTimeout(async () => {
			try {
				const response = await getNewAccessToken();
				const success = response?.[0];
				if (success) {
					const { tokens } = response?.[1];
					const newAccessToken = tokens.accessToken;
					const newAccessTokenExpiry = tokens.accessTokenExpiry;
					const newRefreshTokenExpiry = tokens.refreshTokenExpiry;
					const host = fetchDomainName();

					localStorage.setItem('usertoken', newAccessToken);
					localStorage.setItem('accessTokenExpiry', newAccessTokenExpiry);
					localStorage.setItem('refreshTokenExpiry', newRefreshTokenExpiry);

					Cookies.set('usertoken', newAccessToken, {
						sameSite: 'lax',
						domain: host,
					});

					Cookies.set('accessTokenExpiry', newAccessTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('refreshTokenExpiry', newRefreshTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});

					setAccessTokenExpiry(newAccessTokenExpiry);
				}
			} catch (err) {
				console.error('Token refresh failed', err);
			}
		}, delay);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [accessTokenExpiry]);
};

export default useTokenExpiry;

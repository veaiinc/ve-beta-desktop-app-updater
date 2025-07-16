import Cookies from 'js-cookie';

const logout = () => {
	try {
		const theme = localStorage.getItem('theme');
		const cookieTheme = Cookies.get('theme');

		localStorage.clear();

		if (theme) {
			localStorage.setItem('theme', theme);
		}

		Object.keys(Cookies.get()).forEach((cookieName) => {
			if (cookieName !== 'theme') {
				Cookies.remove(cookieName);
			}
		});

		if (cookieTheme) {
			Cookies.set('theme', cookieTheme, { expires: 365 });
		}

		window.location.replace('/');
	} catch (err) {
		console.error('Failed to perform logout:', err);
	}
};

export default logout;

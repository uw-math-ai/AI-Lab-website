import { base } from '$app/paths';

export function sitePath(path = '/') {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	if (normalized === '/') return base || '/';
	return `${base}${normalized}`;
}

export function routePath(pathname: string) {
	if (base && pathname.startsWith(base)) {
		return pathname.slice(base.length) || '/';
	}
	return pathname || '/';
}

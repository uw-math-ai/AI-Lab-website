import { base } from '$app/paths';

export function sitePath(path = '/') {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	if (normalized === '/') return base || '/';
	return `${base}${normalized}`;
}

export function routePath(pathname: string) {
	const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	// Prerendered pages are served as /research/, the dev server as /research.
	const trimmed = withoutBase.replace(/\/+$/, '');
	return trimmed || '/';
}

export const canonicalHost = 'ai.math.uw.edu';
export const canonicalOrigin = `https://${canonicalHost}`;

export function canonicalPath(path = '/') {
	const withoutHash = path.split('#')[0] || '/';
	const normalized = withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`;
	if (normalized === '/') return '/';
	const lastSegment = normalized.split('/').at(-1) ?? '';
	if (lastSegment.includes('.')) return normalized;
	return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

export function canonicalUrl(path = '/') {
	return `${canonicalOrigin}${canonicalPath(path)}`;
}

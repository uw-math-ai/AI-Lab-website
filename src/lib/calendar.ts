import type { LabEvent } from '$lib/content/schema';

// Events are in Seattle time unless an event gives its own utcOffset, so every instant is worked
// out from the wall-clock time and that zone (daylight saving included), not from the visitor's.
const ZONE = 'America/Los_Angeles';
const SITE = 'https://ai.math.uw.edu';

function zoneOffsetMinutes(instant: number): number {
	const part = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, timeZoneName: 'longOffset' })
		.formatToParts(new Date(instant))
		.find((p) => p.type === 'timeZoneName')?.value;
	const match = part?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
	if (!match) return 0;
	return (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/** The UTC instant (ms) for a date and HH:mm in the event's own zone. */
function instant(date: string, time: string, utcOffset?: string): number {
	if (utcOffset) return new Date(`${date}T${time}:00${utcOffset}`).getTime();
	const [y, m, d] = date.split('-').map(Number);
	const [h, min] = time.split(':').map(Number);
	const naive = Date.UTC(y, m - 1, d, h, min);
	let guess = naive - zoneOffsetMinutes(naive) * 60000;
	guess = naive - zoneOffsetMinutes(guess) * 60000; // settle across a daylight-saving switch
	return guess;
}

/** Events whose start and end are equal have no real hours (a date only), so they get no calendar entry. */
export function hasHours(event: LabEvent): boolean {
	return event.startTime !== event.endTime;
}

function range(event: LabEvent) {
	return {
		start: instant(event.date, event.startTime, event.utcOffset),
		end: instant(event.date, event.endTime, event.utcOffset)
	};
}

const compact = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const iso = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}/, '');

function details(event: LabEvent): string {
	const first = (event.abstract ?? '').split(/\n\s*\n/)[0].trim();
	return [first, event.sourceUrl ?? `${SITE}/events/`].filter(Boolean).join('\n\n');
}

export function googleCalendarUrl(event: LabEvent): string {
	const { start, end } = range(event);
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.title,
		dates: `${compact(start)}/${compact(end)}`,
		details: details(event),
		location: event.location ?? ''
	});
	return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(event: LabEvent): string {
	const { start, end } = range(event);
	const params = new URLSearchParams({
		path: '/calendar/action/compose',
		rru: 'addevent',
		subject: event.title,
		startdt: iso(start),
		enddt: iso(end),
		body: details(event),
		location: event.location ?? ''
	});
	return `https://outlook.office.com/calendar/0/deeplink/compose?${params}`;
}

const icsText = (value: string) => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** A one-event .ics file (Apple Calendar, desktop Outlook, and anything else), as a data URL. */
export function icsFile(event: LabEvent): { href: string; filename: string } {
	const { start, end } = range(event);
	const slug = `${event.date}-${event.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//UW Math AI Lab//Events//EN',
		'BEGIN:VEVENT',
		`UID:${slug}@ai.math.uw.edu`,
		`DTSTAMP:${compact(start)}`,
		`DTSTART:${compact(start)}`,
		`DTEND:${compact(end)}`,
		`SUMMARY:${icsText(event.title)}`,
		`DESCRIPTION:${icsText(details(event))}`,
		...(event.location ? [`LOCATION:${icsText(event.location)}`] : []),
		`URL:${event.sourceUrl ?? `${SITE}/events/`}`,
		'END:VEVENT',
		'END:VCALENDAR'
	];
	return {
		href: `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`,
		filename: `${slug}.ics`
	};
}

export function formatTime(value: string): string {
	const [hour, minute] = value.split(':').map(Number);
	return new Date(2026, 0, 1, hour, minute).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** "4:00 PM-5:30 PM", or null when the event has no real hours. */
export function timeRange(event: LabEvent): string | null {
	if (!hasHours(event)) return null;
	return `${formatTime(event.startTime)}-${formatTime(event.endTime)}${event.timeZoneLabel ? ` ${event.timeZoneLabel}` : ''}`;
}

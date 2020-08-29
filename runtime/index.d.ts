import type { Readable, Writable } from 'svelte/store';

declare module "@sapper/app"
declare module "@sapper/server"
declare module "@sapper/service-worker"

declare module "@sapper/app" {
	export interface Redirect {
		statusCode: number
		location: string
	}

	export interface PreloadContext {
		fetch: typeof window['fetch'];
		error: (statusCode: number, error: string) => void;
		redirect: (statusCode: 301 | 302 | 303 | 307, location: string) => void;
	}

	export interface Page {
		host: string;
		path: string;
		query: Record<string, string>;
		params: Record<string, string>;
	}

	export interface Session {
		[key: string]: string;
	}

	export function goto(href: string, opts: { noscroll?: boolean, replaceState?: boolean }): Promise<void>;
	export function prefetch(href: string): Promise<{ redirect?: Redirect; data?: unknown }>;
	export function prefetchRoutes(pathnames: string[]): Promise<void>;
	export function start(opts: { target: Node }): Promise<void>;
	export const stores: () => {
		preloading: Readable<boolean>,
		page: Readable<Page>,
		session: Writable<Session>
	};
}

declare module "@sapper/server" {
	import { Handler, Req, Res } from '@sapper/internal/manifest-server';

	export type Ignore = string | RegExp | ((uri: string) => boolean) | Ignore[];

	export interface MiddlewareOptions {
		session?: (req: Req, res: Res) => unknown
		ignore?: Ignore
	}

	export function middleware(opts: MiddlewareOptions): Handler;
}

declare module "@sapper/service-worker" {
	export const timestamp: number;
	export const files: string[];
	export const assets: string[];
	export const shell: string[];
	export const routes: Array<{ pattern: RegExp }>;
}

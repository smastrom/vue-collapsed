import { mount } from 'cypress/vue';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mount: typeof mount;
		}
	}
}

export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

Cypress.Commands.add('mount', mount);

/// <reference types="cypress" />

const ERR = '[cypress-wait-frames] - ';

function waitFrames<T>({
	subject: getSubject,
	property,
	frames = 20,
	timeout = 30 * 1000,
}: WaitCmdOpts<T>) {
	getSubject().then((subject) => {
		cy.window().then({ timeout }, (cyWin) => {
			const isWin = 'Cypress' in (subject as Cypress.AUTWindow);
			const isDoc = 'documentElement' in (subject as Document);
			const isEl = !isDoc && 'tagName' in (subject as HTMLElement);
			const isWrappedEl =
				!isEl &&
				isPlainObject(subject) &&
				(subject as JQuery<HTMLElement>).length === 1 &&
				'tagName' in (subject as JQuery<HTMLElement>)['0'];

			if (!isWin && !isDoc && !isEl && !isWrappedEl) {
				throw new Error(
					`${ERR} Invalid subject. It must be either 'cy.window', 'cy.document' or '() => cy.get()'.`
				);
			}

			if (!Array.isArray(property) && typeof property !== 'string') {
				throw new Error(`${ERR} Invalid properties. It must be a string or an array of strings.`);
			}

			if (typeof property === 'string') {
				property = [property];
			}

			return Cypress.Promise.all(
				property.map((prop) =>
					_waitFrames<T>({
						isWin,
						isDoc,
						cyWin,
						target: isWin
							? cyWin
							: isDoc
							? cyWin.document.documentElement
							: isEl
							? (subject as HTMLElement)
							: (subject as JQuery<HTMLElement>)['0'],
						prop,
						frames,
					})
				)
			)
				.then((results) => results)
				.catch((error) => {
					throw error;
				});
		});
	});
}

function isPlainObject(obj: unknown) {
	return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
}

function isPrimitive(value: unknown) {
	return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

function getValue<T>({ isWin, cyWin, target, prop }: GetValueOptions<T>): Primitive {
	if ((prop as string).includes('.')) {
		const [method, _prop] = (prop as string).split('.');
		const rectValue = (
			(target as HTMLElement)[method as keyof HTMLElement] as CallableFunction
		)?.()?.[_prop];

		if (rectValue === undefined || rectValue === null) {
			throw new Error(`${ERR} Invalid or unsupported method: ${prop as string}`);
		}
		return rectValue;
	}

	if (prop in target && isPrimitive(target[prop as keyof typeof target])) {
		return target[prop as keyof typeof target] as Primitive;
	}

	if (isWin) {
		throw new Error(`${ERR} Invalid window property: ${prop as string}`);
	}

	if (!(prop in cyWin.getComputedStyle(target as HTMLElement))) {
		throw new Error(`${ERR} Invalid DOM/CSS property: ${prop as string}`);
	}

	return cyWin.getComputedStyle(target as HTMLElement).getPropertyValue(prop as string);
}

function _waitFrames<T>({ isWin, isDoc, cyWin, target, prop, frames }: RafOptions<T>) {
	return new Cypress.Promise<WaitCmdReturn<T>>((resolve, reject) => {
		const start = cyWin.performance.now();

		let rafId: DOMHighResTimeStamp = 0;
		let prevValue: number | string | undefined | null = getValue<T>({
			isWin,
			cyWin,
			target,
			prop,
		});

		let framesCount = 0;

		function getNextValue() {
			try {
				framesCount++;

				const nextValue = getValue<T>({ isWin, cyWin, target, prop });

				if (prevValue !== nextValue) {
					framesCount = 0;
					prevValue = nextValue;
					return cyWin.requestAnimationFrame(getNextValue);
				}

				if (framesCount === frames) {
					cyWin.cancelAnimationFrame(rafId as DOMHighResTimeStamp);
					resolve({
						subject: (isWin
							? cyWin
							: isDoc
							? cyWin.document
							: target) as WaitCmdReturn<T>['subject'],
						property: prop,
						value: nextValue,
						time: cyWin.performance.now() - start,
					});
				} else {
					cyWin.requestAnimationFrame(getNextValue);
				}
			} catch (error) {
				reject(error);
			}
		}

		rafId = cyWin.requestAnimationFrame(getNextValue);
	});
}

Cypress.Commands.add('waitFrames', waitFrames);

import type { PropertiesHyphen } from 'csstype';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			waitFrames<T>(options: WaitCmdOpts<T>): Chainable<WaitCmdReturn<T>[]>;
		}
	}
}

export type WaitCmdOpts<T> = {
	/** Cypress Chainable.  */
	subject: () => Cypress.Chainable<T>;
	/** DOM/CSS properties to watch for. */
	property: Properties<T> | Properties<T>[];
	/** Number of frames at which function should resolve. */
	frames?: number;
	/** Timeout in ms at which the function should throw an error. */
	timeout?: number;
};

type Properties<T> = T extends Cypress.AUTWindow
	? keyof T | `${keyof Cypress.AUTWindow}.${string}`
	: keyof HTMLElement | keyof PropertiesHyphen | `${keyof HTMLElement}.${string}`;

export type WaitCmdReturn<T> = {
	/** Subject yielded from `subject` option. */
	subject: T extends Cypress.AUTWindow
		? T
		: T extends Document
		? T
		: T extends HTMLElement
		? T
		: T extends JQuery<HTMLElement>
		? T
		: never;
	/** Awaited property name. */
	property: Properties<T>;
	/** Value at which the function resolved. */
	value: Primitive;
	/** Time in ms that took to resolve since invoking. */
	time: DOMHighResTimeStamp;
};

export type Primitive = string | number | undefined | null;

export type GetValueOptions<T> = {
	isWin: boolean;
	cyWin: Cypress.AUTWindow;
	target: Cypress.AUTWindow | HTMLElement;
	prop: Properties<T>;
};

export type RafOptions<T> = GetValueOptions<T> & {
	frames: number;
	isDoc: boolean;
};

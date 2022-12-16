import App from './App.vue';
import { getRandomIntInclusive } from '../../cypress/support/component';

it('Should be able to set different tag name', () => {
	cy.mount(App, {
		props: {
			initialValue: true,
			as: 'section',
		},
	});

	cy.get('#Collapse').should('have.prop', 'tagName', 'SECTION');
});

it('Should have correct styles if collapsed on mount', () => {
	cy.mount(App);

	cy.get('#Collapse')
		.should('have.css', 'display', 'none')
		.and('have.css', 'padding', '0px')
		.and('have.css', 'border', '0px none rgb(0, 0, 0)')
		.and('have.css', 'margin', '0px')
		.and('not.have.css', 'transition', '')
		.and('not.have.css', 'overflow', 'hidden')
		.and((element) => {
			/**
			 * https://github.com/cypress-io/cypress/issues/6309
			 */
			expect(getComputedStyle(element[0]).height).to.eq('auto');
		});
});

it('Should have correct styles if expanded on mount', () => {
	cy.mount(App, {
		props: {
			initialValue: true,
		},
	});

	cy.get('#Collapse')
		.should('have.css', 'padding', '0px')
		.and('have.css', 'border', '0px none rgb(0, 0, 0)')
		.and('have.css', 'margin', '0px')
		.and('not.have.css', 'transition', '')
		.and('not.have.css', 'display', 'none')
		.and('not.have.css', 'overflow', 'hidden');
});

it('Should change height if resizing on expanded', () => {
	cy.mount(App).viewport('macbook-13');

	cy.get('#TriggerButton').click();
	cy.wait(300);

	for (let i = 0; i < 20; i++) {
		cy.get('#Collapse')
			.invoke('height')
			.then((desktopHeight) => {
				cy.viewport('iphone-x');
				cy.wait(300);
				cy.get('#Collapse').invoke('height').should('be.greaterThan', desktopHeight);
			})
			.then((mobileHeight) => {
				cy.viewport('macbook-13');
				cy.wait(300);
				cy.get('#Collapse').invoke('height').should('be.lessThan', mobileHeight);
			});
	}
});

it('Should update data-collapse attribute properly', () => {
	cy.mount(App);

	const randomIter = getRandomIntInclusive(5, 20);

	for (let i = 0; i < randomIter; i++) {
		cy.get('#TriggerButton').click();
		cy.get('#Collapse').should('have.attr', 'data-collapse', 'expanding');
		cy.wait(500);
		cy.get('#Collapse').should('have.attr', 'data-collapse', 'expanded');
		cy.get('#TriggerButton').click();
		cy.get('#Collapse').should('have.attr', 'data-collapse', 'collapsing');
		cy.wait(500);
		cy.get('#Collapse').should('have.attr', 'data-collapse', 'collapsed');
	}
});

describe('Should execute callbacks properly', () => {
	it('Expand as last action', () => {
		cy.mount(App);

		const repeatEven = getRandomIntInclusive(10, 20) * 2;
		for (let i = 0; i < repeatEven; i++) {
			cy.get('#TriggerButton').click();
			cy.wait(50);
		}

		cy.get('#CountExpand').should('have.text', `${repeatEven / 2}`);
		cy.get('#CountExpanded').should('have.text', '0');
		cy.get('#CountCollapse').should('have.text', `${repeatEven / 2}`);
		cy.get('#CountCollapsed').should('have.text', '1');
	});

	it('Collapse as last action', () => {
		cy.mount(App, {
			props: {
				initialValue: true,
			},
		});

		const repeatEven = getRandomIntInclusive(10, 20) * 2;
		for (let i = 0; i < repeatEven; i++) {
			cy.get('#TriggerButton').click();
			cy.wait(50);
		}

		cy.get('#CountExpand').should('have.text', `${repeatEven / 2}`);
		cy.get('#CountExpanded').should('have.text', '1');
		cy.get('#CountCollapse').should('have.text', `${repeatEven / 2}`);
		cy.get('#CountCollapsed').should('have.text', '0');
	});
});

describe('With baseHeight > 0', () => {
	it('Should have correct styles if collapsed on mount', () => {
		cy.mount(App, {
			props: {
				initialValue: false,
				baseHeight: 100,
			},
		});

		cy.get('#Collapse').should('have.css', 'height', '100px').and('have.css', 'overflow', 'hidden');
	});

	it('Should have correct styles if expanded on mount', () => {
		cy.mount(App, {
			props: {
				initialValue: true,
				baseHeight: 100,
			},
		});

		cy.get('#Collapse')
			.should('have.css', 'padding', '0px')
			.and('have.css', 'border', '0px none rgb(0, 0, 0)')
			.and('have.css', 'margin', '0px')
			.and('not.have.css', 'transition', '')
			.and('not.have.css', 'display', 'none')
			.and('not.have.css', 'overflow', 'hidden');
	});

	it('Should collapse to baseHeight', () => {
		cy.mount(App, {
			props: {
				initialValue: true,
				baseHeight: 100,
			},
		});

		cy.get('#TriggerButton').click();
		cy.wait(300);

		cy.get('#Collapse').should('have.css', 'height', '100px').and('have.css', 'overflow', 'hidden');
	});

	it('Should change height if expanded', () => {
		cy.mount(App, {
			props: {
				initialValue: false,
				baseHeight: 100,
			},
		});

		cy.get('#TriggerButton').click();
		cy.wait(300);

		cy.get('#Collapse')
			.invoke('height')
			.then((desktopHeight) => {
				cy.viewport('iphone-x');
				cy.wait(300);
				cy.get('#Collapse').invoke('height').should('be.greaterThan', desktopHeight);
			})
			.then((mobileHeight) => {
				cy.viewport('macbook-13');
				cy.wait(300);
				cy.get('#Collapse').invoke('height').should('be.lessThan', mobileHeight);
			});
	});

	it('Should update collapsed height if editing value', () => {
		const BASE_HEIGHT = 100;
		const INCREMENT = 10;

		cy.mount(App, {
			props: {
				initialValue: false,
				baseHeight: BASE_HEIGHT,
			},
		});

		const randomClicks = getRandomIntInclusive(5, 25);
		for (let i = 1; i < randomClicks + 1; i++) {
			cy.get('#BaseHeightIncr').click();
			cy.get('#Collapse')
				.should('have.css', 'height', `${BASE_HEIGHT + INCREMENT * i}px`)
				.and('have.css', 'overflow', 'hidden');
		}

		cy.get('#Collapse')
			.invoke('height')
			.then((height) => {
				for (let i = 1; i < randomClicks + 1; i++) {
					cy.get('#BaseHeightDecr').click();
					cy.get('#Collapse')
						.should('have.css', 'height', `${Number(height) - INCREMENT * i}px`)
						.and('have.css', 'overflow', 'hidden');
				}
			});
	});
});

import App from './App.vue';

it('Should be able to set different tag name', () => {
	cy.mount(App, {
		props: {
			initialValue: true,
			as: 'section',
		},
	});

	cy.get('#my-collapse-id').should('have.prop', 'tagName', 'SECTION');
});

it('Should have default styles if collapsed on mount', () => {
	cy.mount(App);

	cy.get('#my-collapse-id')
		.should('have.css', 'display', 'none')
		.and('have.css', 'padding', '0px')
		.and('not.have.css', 'transition', '')
		.and('not.have.css', 'overflow', 'hidden')
		.should((element) => {
			/**
			 * https://github.com/cypress-io/cypress/issues/6309
			 */
			expect(getComputedStyle(element[0]).height).to.eq('auto');
		});
});

it('Should have default styles if expanded on mount', () => {
	cy.mount(App, {
		props: {
			initialValue: true,
		},
	});

	cy.get('#my-collapse-id')
		.should('have.css', 'padding', '0px')
		.and('not.have.css', 'transition', '')
		.and('not.have.css', 'display', 'none')
		.and('not.have.css', 'overflow', 'hidden');
});

it('Should change height if resizing on expanded', () => {
	cy.mount(App).viewport('macbook-13');

	cy.get('#TriggerButton').click();
	cy.wait(300);

	for (let i = 0; i < 20; i++) {
		cy.get('#my-collapse-id')
			.invoke('height')
			.then((desktopHeight) => {
				cy.viewport('iphone-x');
				cy.wait(300);
				cy.get('#my-collapse-id').invoke('height').should('be.greaterThan', desktopHeight);
			})
			.then((mobileHeight) => {
				cy.viewport('macbook-13');
				cy.wait(300);
				cy.get('#my-collapse-id').invoke('height').should('be.lessThan', mobileHeight);
			});
	}
});

describe('Should execute onTransitionEnd callbacks only after transition is finished', () => {
	it('Expand as last action', () => {
		cy.mount(App);

		for (let i = 0; i < 20; i++) {
			cy.get('#TriggerButton').click();
			cy.wait(50);
		}

		cy.get('#CountCollapsed').should('have.text', '1');
		cy.get('#CountExpanded').should('have.text', '0');
	});
	it('Collapse as last action', () => {
		cy.mount(App, {
			props: {
				initialValue: true,
			},
		});

		for (let i = 0; i < 20; i++) {
			cy.get('#TriggerButton').click();
			cy.wait(50);
		}

		cy.get('#CountCollapsed').should('have.text', '0');
		cy.get('#CountExpanded').should('have.text', '1');
	});
});

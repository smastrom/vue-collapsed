import { mount } from 'cypress/vue'

import 'cypress-wait-frames'

declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace Cypress {
      interface Chainable {
         mount: typeof mount
      }
   }
}

export function getRandomIntInclusive(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min + 1) + min)
}

Cypress.Commands.add('mount', mount)

export const isFirefox = Cypress.isBrowser('firefox')

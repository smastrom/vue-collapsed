const description = 'CSS height transition from any to auto and vice versa for Vue and Nuxt.'
const title = 'Vue Collapsed'

export function getHead() {
   return {
      title: 'Vue Collapsed - ' + description,
      htmlAttrs: {
         lang: 'en',
      },
      meta: [
         {
            hid: 'description',
            name: 'description',
            content: description,
         },
         {
            hid: 'og:title',
            property: 'og:title',
            content: `${title} - ${description}`,
         },
         {
            hid: 'og:description',
            property: 'og:description',
            content: description,
         },
         {
            hid: 'og:url',
            property: 'og:url',
            content: 'https://notivue.pages.dev',
         },
         {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: `${title} - ${description}`,
         },
         {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: description,
         },
         {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
         },
      ],
   }
}

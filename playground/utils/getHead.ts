const description = 'CSS height transition from any to auto and vice versa for Vue and Nuxt.'
const title = 'Vue Collapsed'

export function getHead() {
   return {
      title: 'Vue Collapsed - ' + description,
      htmlAttributes: {
         lang: 'en',
      },
      meta: [
         {
            key: 'description',
            name: 'description',
            content: description,
         },
         {
            key: 'og:title',
            property: 'og:title',
            content: `${title} - ${description}`,
         },
         {
            key: 'og:description',
            property: 'og:description',
            content: description,
         },
         {
            key: 'og:url',
            property: 'og:url',
            content: 'https://vue-collapsed.pages.dev',
         },
         {
            key: 'twitter:title',
            name: 'twitter:title',
            content: `${title} - ${description}`,
         },
         {
            key: 'twitter:description',
            name: 'twitter:description',
            content: description,
         },
         {
            key: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
         },
      ],
   }
}

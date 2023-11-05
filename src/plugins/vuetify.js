/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#EEEEEE', // Grey lighten 3
          'background-darken': '#BDBDBD', // Grey lighten 1
          primary: '#673ab7', // Deep purple base
          secondary: '#009688', // Teal base
          accent: '#4caf50', // Green base
          error: '#F44336', // Red base
          warning: '#ffc107', // Amber base
          info: '#607d8b',  // Blue-grey base
          success: '#8bc34a' // Light-green base
        },
      },
    },
  },
})

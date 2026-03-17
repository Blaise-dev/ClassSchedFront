import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import { createApp } from 'vue'
import App from './App.vue' 
import router from './router'
import store from './store'
import './assets/theme.css'
import { FontAwesomeIcon } from "./plugins/font-awesome"
import '@fortawesome/fontawesome-free/css/all.css'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')

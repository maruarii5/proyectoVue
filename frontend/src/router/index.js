import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue' // Asegúrate de que esta ruta llegue a tu archivo

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // ESTA ES LA CLAVE: El path '/' es lo que carga al abrir la página
      path: '/', 
      name: 'login',
      component: Auth // Aquí le decimos que cargue tu diseño oscuro del login
    },
    {
      // Esta sería la pantalla a la que entran DESPUÉS de poner su contraseña
      path: '/dashboard', 
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    }
  ]
})

export default router
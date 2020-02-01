import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RandomPlanet from '../views/RandomPlanet.vue'
import Starmap from "../views/Starmap.vue";
import Exoplanet from "../views/Exoplanet.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/exoplanets/random',
    name: 'random exoplanet',
    component: RandomPlanet
  }, 
  {
    path: "/starmap",
    name: "Starmap",
    component: Starmap
  },
  {
    path: "/exoplanets/planet/:exoplanet",
    name: "Exoplanet",
    component: Exoplanet
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

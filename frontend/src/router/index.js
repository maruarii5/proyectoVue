import { createRouter, createWebHistory } from "vue-router";

// Login
import Auth from "../views/Auth.vue";

// Layout principal
import Layout from "../components/Layout.vue";

// Vistas
import DashboardView from "../views/DashboardView.vue";
import EstadosView from "../views/EstadosView.vue";
import MunicipiosView from "../views/MunicipiosView.vue";
import LocalidadesView from "../views/LocalidadesView.vue";
import GenerosView from "../views/GenerosView.vue";
import TipoPersonalView from "../views/TipoPersonalView.vue";
import CarrerasView from "../views/CarrerasView.vue";
import AsignaturasView from "../views/AsignaturasView.vue";
import DatosPersonalesView from "../views/DatosPersonalesView.vue";
import PersonalView from "../views/PersonalView.vue";
import IntendenciaView from "../views/IntendenciaView.vue";
import AlumnosView from "../views/AlumnosView.vue";
import DatosEscuelaView from "../views/DatosEscuelaView.vue";
import UsuariosView from "../views/UsuariosView.vue";
import RolesView from "../views/RolesView.vue";

const router = createRouter({

    history: createWebHistory(),

    routes: [

        // ==========================
        // LOGIN
        // ==========================

        {

            path: "/",

            name: "login",

            component: Auth

        },

        // ==========================
        // SISTEMA
        // ==========================

        {

            path: "/",

            component: Layout,

            children: [

                {

                    path: "dashboard",

                    name: "dashboard",

                    component: DashboardView

                },

                {

                    path: "estados",

                    name: "estados",

                    component: EstadosView

                },

                {

                    path: "municipios",

                    name: "municipios",

                    component: MunicipiosView

                },

                {

                    path: "localidades",

                    name: "localidades",

                    component: LocalidadesView

                },

                {

                    path: "generos",

                    name: "generos",

                    component: GenerosView

                },

                {

                    path: "tipopersonal",

                    name: "tipopersonal",

                    component: TipoPersonalView

                },

                {

                    path: "carreras",

                    name: "carreras",

                    component: CarrerasView

                },

                {

                    path: "asignaturas",

                    name: "asignaturas",

                    component: AsignaturasView

                },

                {

                    path: "datospersonales",

                    name: "datospersonales",

                    component: DatosPersonalesView

                },

                {

                    path: "personal",

                    name: "personal",

                    component: PersonalView

                },

                {

                    path: "intendencia",

                    name: "intendencia",

                    component: IntendenciaView

                },

                {

                    path: "alumnos",

                    name: "alumnos",

                    component: AlumnosView

                },

                {

                    path: "datosescuela",

                    name: "datosescuela",

                    component: DatosEscuelaView

                },

                {

                    path: "usuarios",

                    name: "usuarios",

                    component: UsuariosView

                },

                {

                    path: "roles",

                    name: "roles",

                    component: RolesView

                }

            ]

        }

    ]

});

export default router;
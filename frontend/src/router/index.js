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

                    component: DashboardView

                },

                {

                    path: "estados",

                    component: EstadosView

                },

                {

                    path: "municipios",

                    component: MunicipiosView

                },

                {

                    path: "localidades",

                    component: LocalidadesView

                },

                {

                    path: "generos",

                    component: GenerosView

                },

                {

                    path: "tipopersonal",

                    component: TipoPersonalView

                },

                {

                    path: "carreras",

                    component: CarrerasView

                },

                {

                    path: "asignaturas",

                    component: AsignaturasView

                },

                {

                    path: "datospersonales",

                    component: DatosPersonalesView

                },

                {

                    path: "personal",

                    component: PersonalView

                },

                {

                    path: "intendencia",

                    component: IntendenciaView

                },

                {

                    path: "alumnos",

                    component: AlumnosView

                },

                {

                    path: "datosescuela",

                    component: DatosEscuelaView

                },

                {

                    path: "usuarios",

                    component: UsuariosView

                },

                {

                    path: "roles",

                    component: RolesView

                }

            ]

        }

    ]

});

export default router;
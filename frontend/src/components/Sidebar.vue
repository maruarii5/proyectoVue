<template>

    <aside class="sidebar">

        <!-- ========================= -->
        <!-- TÍTULO -->
        <!-- ========================= -->
        <div class="logo">

            <h2>🎓 Sistema Escolar</h2>

        </div>

        <!-- ========================= -->
        <!-- DASHBOARD -->
        <!-- ========================= -->
        <div class="grupo">

            <h3>🏠 Dashboard</h3>

            <RouterLink
                class="menu-item"
                to="/dashboard"
            >
                Inicio
            </RouterLink>

        </div>

        <!-- ========================= -->
        <!-- CATÁLOGOS -->
        <!-- ========================= -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>📍 Catálogos</h3>

            <RouterLink class="menu-item" to="/estados">
                Estados
            </RouterLink>

            <RouterLink class="menu-item" to="/municipios">
                Municipios
            </RouterLink>

            <RouterLink class="menu-item" to="/localidades">
                Localidades
            </RouterLink>

            <RouterLink class="menu-item" to="/generos">
                Géneros
            </RouterLink>

            <RouterLink class="menu-item" to="/tipopersonal">
                Tipo de Personal
            </RouterLink>

            <RouterLink class="menu-item" to="/carreras">
                Carreras
            </RouterLink>

            <RouterLink class="menu-item" to="/asignaturas">
                Asignaturas
            </RouterLink>

        </div>

        <!-- ========================= -->
        <!-- PERSONAS -->
        <!-- ========================= -->
        <div class="grupo">

            <h3>👥 Personas</h3>

            <RouterLink
                class="menu-item"
                to="/datospersonales"
            >
                Datos Personales
            </RouterLink>

            <RouterLink
                class="menu-item"
                to="/personal"
            >
                Personal
            </RouterLink>

            <RouterLink
                class="menu-item"
                to="/intendencia"
            >
                Intendencia
            </RouterLink>

            <RouterLink
                class="menu-item"
                to="/alumnos"
            >
                Alumnos
            </RouterLink>

        </div>

        <!-- ========================= -->
        <!-- ESCUELA -->
        <!-- ========================= -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>🏫 Escuela</h3>

            <RouterLink
                class="menu-item"
                to="/datosescuela"
            >
                Datos Escuela
            </RouterLink>

        </div>

        <!-- ========================= -->
        <!-- SEGURIDAD -->
        <!-- ========================= -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>🔐 Seguridad</h3>

            <RouterLink
                class="menu-item"
                to="/usuarios"
            >
                Usuarios
            </RouterLink>

            <RouterLink
                class="menu-item"
                to="/roles"
            >
                Roles
            </RouterLink>

        </div>

    </aside>

</template>

<script setup>

import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";

// Obtiene la información del usuario autenticado
const authStore = useAuthStore();

// Verifica si el usuario tiene rol Administrador
const esAdministrador = computed(() => {

    return authStore.usuario?.idRol === 1;

});

</script>

<style scoped>

.sidebar{

    width:280px;
    min-height:100vh;
    background:#111827;
    color:white;
    padding:25px;
    overflow-y:auto;
    border-right:1px solid #374151;

}

.logo{

    text-align:center;
    margin-bottom:35px;

}

.logo h2{

    margin:0;
    color:white;
    font-size:1.4rem;

}

.grupo{

    margin-bottom:30px;

}

.grupo h3{

    color:#93c5fd;
    margin-bottom:12px;
    border-bottom:1px solid #374151;
    padding-bottom:8px;
    font-size:1rem;

}

.menu-item{

    display:block;
    text-decoration:none;
    color:white;
    background:#1f2937;
    padding:12px;
    margin-bottom:8px;
    border-radius:8px;
    transition:all .25s;

}

.menu-item:hover{

    background:#374151;
    transform:translateX(6px);

}

/* Ruta activa */

.router-link-active{

    background:#2563eb;
    font-weight:bold;

}

</style>
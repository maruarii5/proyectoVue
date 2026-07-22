<template>

    <aside class="sidebar">

        <!-- Logo -->
        <div class="logo">

            <h2>🎓 Sistema Escolar</h2>

        </div>

        <!-- Dashboard -->
        <div class="grupo">

            <h3>🏠 Dashboard</h3>

            <RouterLink
                class="menu-item"
                to="/dashboard"
            >
                Inicio
            </RouterLink>

        </div>

        <!-- Catálogos -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>📂 Catálogos</h3>

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

        <!-- Personas -->
        <div class="grupo">

            <h3>👥 Personas</h3>

            <RouterLink class="menu-item" to="/datospersonales">
                Datos Personales
            </RouterLink>

            <RouterLink class="menu-item" to="/personal">
                Personal
            </RouterLink>

            <RouterLink class="menu-item" to="/intendencia">
                Intendencia
            </RouterLink>

            <RouterLink class="menu-item" to="/alumnos">
                Alumnos
            </RouterLink>

        </div>

        <!-- Escuela -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>🏫 Escuela</h3>

            <RouterLink class="menu-item" to="/datosescuela">
                Datos Escuela
            </RouterLink>

        </div>

        <!-- Seguridad -->
        <div
            v-if="esAdministrador"
            class="grupo"
        >

            <h3>🔐 Seguridad</h3>

            <RouterLink class="menu-item" to="/usuarios">
                Usuarios
            </RouterLink>

            <RouterLink class="menu-item" to="/roles">
                Roles
            </RouterLink>

        </div>

        <!-- Sesión -->
        <div class="grupo">

            <h3>⚙ Cuenta</h3>

            <button
                class="btn-salir"
                @click="cerrarSesion"
            >
                Cerrar sesión
            </button>

        </div>

    </aside>

</template>

<script setup>

import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();

const authStore = useAuthStore();

const esAdministrador = computed(() => {

    return authStore.usuario?.idRol === 1;

});

async function cerrarSesion(){

    try{

        await fetch(

            "http://localhost:3000/api/auth/logout",

            {

                method:"POST",

                credentials:"include"

            }

        );

    }

    catch(error){

        console.error(error);

    }

    authStore.cerrarSesion();

    router.push("/");

}

</script>

<style scoped>

.sidebar{

    width:280px;

    min-width:280px;

    min-height:100vh;

    background:#111827;

    color:white;

    padding:25px;

    overflow-y:auto;

    border-right:1px solid #374151;

    display:flex;

    flex-direction:column;

}

.logo{

    text-align:center;

    margin-bottom:35px;

}

.logo h2{

    margin:0;

    color:white;

    font-size:24px;

}

.grupo{

    margin-bottom:28px;

}

.grupo h3{

    color:#93c5fd;

    margin-bottom:12px;

    border-bottom:1px solid #374151;

    padding-bottom:8px;

    font-size:15px;

    text-transform:uppercase;

    letter-spacing:.5px;

}

.menu-item{

    display:block;

    text-decoration:none;

    color:#f3f4f6;

    background:#1f2937;

    padding:12px 14px;

    margin-bottom:8px;

    border-radius:8px;

    transition:.25s;

    font-size:15px;

}

.menu-item:hover{

    background:#374151;

    transform:translateX(5px);

}

.router-link-active{

    background:#2563eb;

    color:white;

    font-weight:bold;

}

.btn-salir{

    width:100%;

    background:#dc2626;

    color:white;

    border:none;

    padding:12px;

    border-radius:8px;

    cursor:pointer;

    font-size:15px;

    transition:.25s;

}

.btn-salir:hover{

    background:#b91c1c;

}

</style>
<template>

    <header class="header">

        <div>

            <h2>Sistema Escolar</h2>

        </div>

        <div class="usuario">

            <p>

                <strong>{{ usuario.nombre }}</strong>

            </p>

            <small>

                {{ nombreRol }}

            </small>

        </div>

    </header>

</template>

<script setup>

import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";


// Obtiene el almacén de autenticación
const authStore = useAuthStore();

// Usuario autenticado
const usuario = computed(() => authStore.usuario || {});

// Convierte el id del rol en un nombre
const nombreRol = computed(() => {

    return usuario.value.idRol === 1
        ? "Administrador"
        : "Usuario";

});


</script>

<style scoped>

.header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:20px;

    background:#1f2937;

    color:white;

}

.usuario{

    text-align:right;

}

small{

    color:#d1d5db;

}

</style>
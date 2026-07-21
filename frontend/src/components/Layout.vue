<template>

    <div class="layout">

        <!-- Menú lateral -->
        <Sidebar />

        <!-- Zona principal -->
        <div class="contenido">

            <!-- Encabezado -->
            <Header />

            <!-- Aquí aparecerá Dashboard,
                 Estados, Municipios, etc. -->
            <!-- Aquí se cargará la vista correspondiente a la ruta -->
            <RouterView />

        </div>

    </div>

</template>

<script setup>

import { RouterView } from "vue-router";

// Importa los componentes
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

</script>

<style scoped>

.layout{

    display:flex;

    min-height:100vh;

}

.contenido{

    flex:1;

    background:#f4f4f4;

}

</style>
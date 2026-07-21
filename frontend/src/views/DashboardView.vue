<template>

    <div class="dashboard-container">

        <h1>Sistema Escolar</h1>

        <hr>

        <h2>Bienvenido</h2>

        <p>

            <strong>Nombre:</strong>

            {{ usuario.nombre }}

        </p>

        <p>

            <strong>Usuario:</strong>

            {{ usuario.usuario }}

        </p>

        <p>

            <strong>Rol:</strong>

            {{ nombreRol }}

        </p>

    </div>

</template>

<script setup>

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Aquí guardaremos la información del usuario
const usuario = ref({});

// Convierte el idRol en un nombre entendible
const nombreRol = computed(() => {

    return usuario.value.idRol === 1
        ? "Administrador"
        : "Usuario";

});

// Cuando cargue el Dashboard...
onMounted(async () => {

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/me",
            {
                credentials: "include"
            }
        );

        // Si el usuario no tiene sesión,
        // regresamos al Login.
        if (!response.ok) {

            router.push("/");

            return;

        }

        const data = await response.json();

        usuario.value = data.usuario;

    }

    catch (error) {

        router.push("/");

    }

});

</script>

<style scoped>

.dashboard-container{

    max-width:700px;

    margin:auto;

    margin-top:40px;

    padding:30px;

    border-radius:10px;

    background:white;

    box-shadow:0 0 15px rgba(0,0,0,.2);

}

</style>
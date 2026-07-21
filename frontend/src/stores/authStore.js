import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {

    // Información del usuario autenticado
    const usuario = ref(null);

    // Indica si hay una sesión iniciada
    const autenticado = computed(() => {

        return usuario.value !== null;

    });

    // Guarda la información del usuario
    function setUsuario(datosUsuario) {

        usuario.value = datosUsuario;

    }

    // Borra la información del usuario
    function cerrarSesion() {

        usuario.value = null;

    }

    return {

        usuario,
        autenticado,
        setUsuario,
        cerrarSesion

    };

});
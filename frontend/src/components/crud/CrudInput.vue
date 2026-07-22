<template>

    <div class="grupo">

        <label v-if="label">

            {{ label }}

        </label>

        <input
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
        >

    </div>

</template>

<script setup>

defineProps({

    modelValue:{

        type:[String, Number],

        default:""

    },

    label:{

        type:String,

        default:""

    },

    placeholder:{

        type:String,

        default:""

    },

    type:{

        type:String,

        default:"text"

    },

    disabled:{

        type:Boolean,

        default:false

    }

});

defineEmits([

    "update:modelValue"

]);

</script>

<style scoped>

.grupo{

    display:flex;

    flex-direction:column;

    margin-bottom:20px;

}

label{

    margin-bottom:8px;

    font-weight:bold;

    color:#374151;

}

input{

    padding:12px;

    border:1px solid #d1d5db;

    border-radius:8px;

    font-size:15px;

    outline:none;

    transition:.25s;

}

input:focus{

    border-color:#2563eb;

    box-shadow:0 0 0 3px rgba(37,99,235,.15);

}

input:disabled{

    background:#f3f4f6;

    color:#6b7280;

    cursor:not-allowed;

}

</style>
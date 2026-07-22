<template>

    <div class="grupo">

        <label v-if="label">

            {{ label }}

        </label>

        <select
            :value="modelValue"
            @change="$emit('update:modelValue', Number($event.target.value))"
        >

            <option value="">

                {{ placeholder }}

            </option>

            <option
                v-for="item in options"
                :key="item[valueField]"
                :value="item[valueField]"
            >

                {{ item[textField] }}

            </option>

        </select>

    </div>

</template>

<script setup>

defineProps({

    modelValue:{

        type:[Number,String],

        default:""

    },

    label:{

        type:String,

        default:""

    },

    placeholder:{

        type:String,

        default:"Seleccione una opción"

    },

    options:{

        type:Array,

        default:()=>[]

    },

    valueField:{

        type:String,

        default:"id"

    },

    textField:{

        type:String,

        default:"Nombre"

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

select{

    padding:12px;

    border:1px solid #d1d5db;

    border-radius:8px;

    font-size:15px;

    outline:none;

    transition:.25s;

    background:white;

}

select:focus{

    border-color:#2563eb;

    box-shadow:0 0 0 3px rgba(37,99,235,.15);

}

</style>
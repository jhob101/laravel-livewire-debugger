<script>
export default {
    name: "LivewireComponent",
    props: {
        name: {
            type: String
        },
        id: {
            type: String
        },
        index: {
            type: Number
        },
        livewireProperties: {
            type: Object
        }
    },
    emits: ['update-livewire-property'],
    watch: {
        livewireProperties: {
            handler(newVal) {
                if (newVal) {
                    this.properties = JSON.parse(JSON.stringify(newVal));
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            properties: {}
        }
    },
    created() {
        if (this.livewireProperties) {
            this.properties = JSON.parse(JSON.stringify(this.livewireProperties));
        }
    },
    methods: {
        updateProperty(key, value) {
            // Only emit the event when a user explicitly changes a value
            this.$emit('update-livewire-property', {
                index: this.index,
                property: key,
                value: value
            });
        }
    }
}
</script>

<template>
</template>

<style scoped>
</style>

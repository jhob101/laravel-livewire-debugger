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

        // Override the component name for Vue devtools
        if (this.name) {
            // This is a hack to make the component show up with the Livewire name in Vue devtools
            this.$options.name = this.name;

            // For Vue 3 devtools compatibility
            if (this.$options.__name) {
                this.$options.__name = this.name;
            }
        }
    },
    methods: {
        updateProperty(key, value) {
            // Emit update event when a property changes value
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
<div class="livewire-component">
    <div class="component-header">{{ name || 'Unnamed Component' }} ({{ id }})</div>
    <div class="component-properties">
        <div v-for="(value, key) in properties" :key="key" class="property">
            <span class="property-name">{{ key }}:</span>
            <span class="property-value">{{ value }}</span>
        </div>
    </div>
</div>
</template>

<style scoped>
</style>

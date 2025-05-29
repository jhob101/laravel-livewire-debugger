<script>
import LivewireComponent from "./LivewireComponent.vue";

export default {
    components: {
        LivewireComponent,
    },
    data() {
        return {
            livewire: [],
        }
    },
    created() {
        // Initialize with current Livewire components
        this.updateLivewire();

        // Set up hook for Livewire updates
        if (window.Livewire) {
            // Livewire 3 uses different hooks
            if (typeof window.Livewire.hook === 'function') {
                window.Livewire.hook('commit', ({ component }) => {
                    this.updateLivewire();
                });
            } else if (typeof window.Livewire.hooks === 'object') {
                // Fallback for Livewire 2
                window.Livewire.hooks.afterDomUpdate(() => this.updateLivewire());
            }
        }
    },
    methods: {
        updateLivewire() {
            if (!window.Livewire) return;

            try {
                // Livewire 3 stores components differently
                if (typeof window.Livewire.all === 'function') {
                    // Livewire 2 approach
                    this.livewire = window.Livewire.all();
                } else if (window.Livewire.components) {
                    // Livewire 3 approach
                    const components = [];
                    window.Livewire.components.components.forEach(component => {
                        components.push({
                            id: component.id,
                            name: component.name,
                            ephemeral: component.snapshot.data
                        });
                    });
                    this.livewire = components;
                }
            } catch (error) {
                console.error('Error updating Livewire components:', error);
            }
        },

        updateLivewireProperty(event) {
            try {
                const { index, property, value } = event;
                const component = this.livewire[index];

                if (!component) return;

                // Livewire 3 uses a different approach to update properties
                if (window.Livewire.components) {
                    // Find the component by ID
                    const livewireComponent = window.Livewire.find(component.id);
                    if (livewireComponent) {
                        // Use the appropriate method to update the property
                        livewireComponent.set(property, value);
                    }
                } else if (typeof window.Livewire.find === 'function') {
                    // Livewire 2 approach
                    const livewireComponent = window.Livewire.find(component.id);
                    if (livewireComponent && livewireComponent.$wire) {
                        livewireComponent.$wire.set(property, value);
                    }
                }
            } catch (error) {
                console.error('Error updating Livewire property:', error);
            }
        }
    },
}
</script>

<template>
    <div class="wrapper">
        <LivewireComponent
            v-for="(item, index) in livewire"
            :id="item.id"
            :index="index"
            :name="item.name"
            :livewire-properties="item.ephemeral"
            @update-livewire-property="updateLivewireProperty"
            :key="item.id"
        />
    </div>
</template>

<style scoped>
.wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    z-index: 99999;
}
</style>

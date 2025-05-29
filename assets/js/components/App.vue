<script>
import LivewireComponent from "./LivewireComponent.vue";

export default {
  components: {
    LivewireComponent,
  },
  data() {
    return {
      livewire: [],
      updateInterval: null,
      lastComponentCount: 0
    }
  },
  created() {
    // Initialise with current Livewire components
    this.updateLivewire();

    // Set up hook for Livewire updates
    if (window.Livewire) {
      // Livewire 3 uses different hooks
      if (typeof window.Livewire.hook === 'function') {
        // Listen for various Livewire 3 events that might indicate component changes
        window.Livewire.hook('component.init', () => this.updateLivewire());
        window.Livewire.hook('commit', () => this.updateLivewire());
        window.Livewire.hook('commit.after', () => this.updateLivewire());
        window.Livewire.hook('message.processed', () => this.updateLivewire());

        // Also listen for DOM mutations that might indicate new Livewire components
        this.observeDomChanges();

        // Set up event listener for Livewire events
        window.addEventListener('livewire:initialized', () => this.updateLivewire());
        window.addEventListener('livewire:load', () => this.updateLivewire());
        window.addEventListener('livewire:update', () => this.updateLivewire());
      } else if (typeof window.Livewire.hooks === 'object') {
        // Fallback for Livewire 2
        window.Livewire.hooks.afterDomUpdate(() => this.updateLivewire());
      }

      // Set up a periodic check for new components (helpful for lazy-loaded components)
      this.updateInterval = setInterval(() => {
        this.checkForNewComponents();
      }, 1000);
    }
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Clean up event listeners
    window.removeEventListener('livewire:initialized', this.updateLivewire);
    window.removeEventListener('livewire:load', this.updateLivewire);
    window.removeEventListener('livewire:update', this.updateLivewire);
  },
  methods: {
    observeDomChanges() {
      // Create a MutationObserver to watch for DOM changes that might indicate new Livewire components
      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        // Check if any mutations involve elements with wire:id attribute
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) { // Element node
                // Check if this element or any of its children has wire:id
                if (node.hasAttribute && node.hasAttribute('wire:id') ||
                    node.querySelector && node.querySelector('[wire\\:id]')) {
                  shouldUpdate = true;
                  break;
                }
              }
            }
          }
          if (shouldUpdate) break;
        }

        if (shouldUpdate) {
          // Wait a short time for Livewire to fully initialise the component
          setTimeout(() => this.updateLivewire(), 100);
        }
      });

      // Start observing the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    checkForNewComponents() {
      if (!window.Livewire) return;

      try {
        let currentCount = 0;

        // Count current components based on Livewire version
        if (typeof window.Livewire.all === 'function') {
          currentCount = Object.keys(window.Livewire.all()).length;
        } else if (window.Livewire.components) {
          currentCount = window.Livewire.components.components.size;
        }

        // If component count has changed, update the list
        if (currentCount !== this.lastComponentCount) {
          this.updateLivewire();
          this.lastComponentCount = currentCount;
        }
      } catch (error) {
        console.error('Error checking for new components:', error);
      }
    },

    updateLivewire() {
      if (!window.Livewire) return;

      try {
        if (typeof window.Livewire.all === 'function') {
          // Livewire 2
          this.livewire = window.Livewire.all();
        } else if (window.Livewire.components) {
          // Livewire 3
          const components = [];
          window.Livewire.components.components.forEach(component => {
            components.push({
              id: component.id,
              name: component.name,
              ephemeral: component.snapshot.data
            });
          });
          this.livewire = components;
          this.lastComponentCount = components.length;
        }
      } catch (error) {
        console.error('Error updating Livewire components:', error);
      }
    },

    updateLivewireProperty(event) {
      try {
        const {index, property, value} = event;
        const component = this.livewire[index];

        if (!component) return;


        if (window.Livewire.components) {
          // Livewire 3
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
    <div class="header">
      <h3>Livewire Components ({{ livewire.length }})</h3>
    </div>
    <div class="components-container">
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
  </div>
</template>

<style scoped>
.wrapper {
  display: none;
  position: fixed;
  bottom: 5px;
  right: 5px;
  max-width: 300px;
  max-height: 400px;
  background: #222;
  z-index: 99999;
  border: 1px solid #333;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: "Courier New", sans-serif;
}

.header {
  padding: 5px;
}

.header h3 {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
}

.components-container {
  max-height: 350px;
  overflow-y: auto;
}


</style>

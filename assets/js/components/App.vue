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
        currentCount = Object.keys(window.Livewire.all()).length;

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
        this.livewire = window.Livewire.all();
      } catch (error) {
        console.error('Error updating Livewire components:', error);
      }
    }
  }
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

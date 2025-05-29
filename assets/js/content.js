import { createApp } from 'vue';
import App from "./components/App.vue";

// Wait for the page to fully load
window.addEventListener('load', () => {
  // Give Livewire time to initialize
  setTimeout(() => {
    // Check if Livewire is available
    if (window.Livewire) {
      console.log('Livewire Debugger: Livewire detected');
      
      // Create container for the debugger
      const container = document.createElement("div");
      container.id = "livewire-debugger-container";
      document.body.appendChild(container);
      
      // Create and mount Vue app
      const app = createApp(App);
      app.mount(container);
      
      console.log('Livewire Debugger: Initialized');
    } else {
      console.log('Livewire Debugger: Livewire not detected on this page');
    }
  }, 500); // Wait 500ms to ensure Livewire is fully initialized
});

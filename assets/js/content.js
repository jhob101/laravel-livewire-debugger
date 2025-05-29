import { createApp } from 'vue';
import App from "./components/App.vue";

// Check if Livewire is available
function checkForLivewire() {
  return window.Livewire !== undefined;
}

// Initialise the debugger
function initializeDebugger() {
  console.log('Livewire Debugger: Initializing...');

  // Create container for the debugger
  const existingContainer = document.getElementById('livewire-debugger-container');
  if (existingContainer) {
    console.log('Livewire Debugger: Container already exists');
    return;
  }

  const container = document.createElement("div");
  container.id = "livewire-debugger-container";
  document.body.appendChild(container);

  // Create and mount Vue app
  const app = createApp(App);
  app.mount(container);

  console.log('Livewire Debugger: Initialized');
}

function init() {
  // Check if Livewire is already available
  if (checkForLivewire()) {
    console.log('Livewire Debugger: Livewire detected');
    initializeDebugger();
  }
}

// Wait for the page to fully load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

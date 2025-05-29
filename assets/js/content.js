import { createApp } from 'vue';
import App from "./components/App.vue";

if (window.Livewire) {
    const div = document.createElement("div");
    document.body.prepend(div);

    createApp(App).mount(div);
}

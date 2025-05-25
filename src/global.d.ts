// src/global.d.ts

import  AntojarPopupService from './Components/Home/Antojar/antojar-popup'; // ajusta la ruta

declare global {
  interface Window {
    AntojarPopupService: typeof AntojarPopupService;
  }
}

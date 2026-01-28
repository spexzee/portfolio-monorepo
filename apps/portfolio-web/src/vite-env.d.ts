/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly SSR: boolean
  readonly VITE_DEBUG_PASSWORD: string
  readonly VITE_API_URL: string
  readonly VITE_APP_API_URL: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  readonly VITE_APP_EMAILJS_SERVICE_ID: string
  readonly VITE_APP_EMAILJS_TEMPLATE_ID: string
  readonly VITE_APP_EMAILJS_PUBLIC_KEY: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// React Tilt module declarations
declare module 'react-tilt' {
  import { Component } from 'react';
  
  interface TiltOptions {
    max?: number;
    scale?: number;
    speed?: number;
    glare?: boolean;
    'max-glare'?: number;
    reverse?: boolean;
    transition?: boolean;
    axis?: string;
    reset?: boolean;
    easing?: string;
    perspective?: number;
  }
  
  interface TiltProps {
    options?: TiltOptions;
    className?: string;
    children?: React.ReactNode;
  }
  
  export class Tilt extends Component<TiltProps> {}
  export default Tilt;
}

// Maath module declaration
declare module 'maath/random/dist/maath-random.esm' {
  export function inSphere(array: Float32Array, options: { radius: number }): Float32Array;
}
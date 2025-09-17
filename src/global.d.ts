// src/global.d.ts
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  declare module '*.jpg';
  declare module '*.jpeg';
  declare module '*.png';
  declare module '*.gif';
  declare module '*.svg';
  
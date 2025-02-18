declare module '@fancyapps/ui' {
    interface FancyboxOptions {
      loop?: boolean;
      keyboard?: boolean;
      toolbar?: boolean;
      buttons?: string[];
      // Fancybox özelliklerinize göre başka seçenekler ekleyebilirsiniz
    }
  
    class Fancybox {
      constructor(selector: string | HTMLElement, options?: FancyboxOptions);
      open(): void;
      close(): void;
      // Diğer methodlar ekleyebilirsiniz
    }
  
    export { Fancybox };
  }
  
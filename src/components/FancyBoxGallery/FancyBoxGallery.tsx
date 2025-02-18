import React, { useRef, useEffect } from "react";

import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";  // Fancybox CSS dosyasını dahil edin
interface FancyBoxGalleryProps {
  delegate?: string;
  options?: object;
  children: React.ReactNode;
}
const FancyBoxGallery: React.FC<FancyBoxGalleryProps> = (props:any) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props.delegate || "[data-fancybox]";
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{props.children}</div>;
};

export default FancyBoxGallery;

declare module 'dom-to-image-more' {
  interface Options {
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    quality?: number;
    cacheBust?: boolean;
    imagePlaceholder?: string;
  }

  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;

  export { toBlob, toPng, toSvg, toJpeg, toPixelData, Options };
  const domtoimage: {
    toBlob: typeof toBlob;
    toPng: typeof toPng;
    toSvg: typeof toSvg;
    toJpeg: typeof toJpeg;
    toPixelData: typeof toPixelData;
  };
  export default domtoimage;
}

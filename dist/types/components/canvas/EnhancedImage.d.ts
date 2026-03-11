export type Props = {
    id: string;
    image: string;
    cropWidth: number;
    cropHeight: number;
    zoom: number;
    rotation: number;
    brightness?: number;
    contrast?: number;
};
export declare function EnhancedImage({ id, image, cropWidth, cropHeight, zoom, rotation, brightness, contrast, }: Props): import("react/jsx-runtime").JSX.Element;

import { FunctionComponent } from "react";
export type Props = {
    id: string;
    image: string;
    cropWidth: number;
    cropHeight: number;
    zoom: number;
    rotation: number;
};
export declare const EnhancedImage: FunctionComponent<Props>;

import { FinalImageResult } from "../../stores/finalImageStore";
export declare const useImageExporter: (canvasId: string) => {
    exportFinalImage: () => Promise<FinalImageResult | null>;
};

import BrandingOverlay from "./Product/BrandingOverlay";
import LoopBanner from "./banner/LoopBanner";
export function OverlayHome() {
    return (
        <div className="h-64 w-full bg-amber-300 rounded-lg flex items-center justify-center overflow-hidden">
            <LoopBanner height="h-64" interval={5000} className="w-full h-full" />
        </div>
    );
}
export function OverlayBrands() {
    return (
        <div className="w-full h-20">
            <BrandingOverlay />
        </div>
    );
}
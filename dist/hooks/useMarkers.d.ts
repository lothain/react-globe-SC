/// <reference types="react" />
import { Marker, MarkerCallback, MarkerOptions } from '../types';
interface Handlers {
    onClick: MarkerCallback;
    onMouseOver: MarkerCallback;
}
export default function useMarkers<T>(markers: Marker[], { animationDuration, enableGlow, glowCoefficient, glowPower, glowRadiusScale, offsetRadiusScale, radiusScaleRange, renderer, type, }: MarkerOptions, { onClick, onMouseOver }: Handlers): React.RefObject<THREE.Group>;
export {};

/// <reference types="react" />
import { GlobeOptions } from '../types';
export default function useGlobe<T>({ backgroundTexture, cloudsOpacity, cloudsSpeed, cloudsTexture, enableBackground, enableClouds, enableGlow, glowCoefficient, glowColor, glowPower, glowRadiusScale, texture, }: GlobeOptions, onTextureLoaded?: () => void): React.RefObject<THREE.Group>;

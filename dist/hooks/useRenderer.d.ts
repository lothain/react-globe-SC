/// <reference types="react" />
import { Size } from '../types';
export default function useRenderer<T>(size: Size): [React.RefObject<THREE.WebGLRenderer>, React.RefObject<HTMLCanvasElement>];

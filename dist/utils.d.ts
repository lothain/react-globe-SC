import { Coordinates, EasingFunction, Position } from './types';
export declare function coordinatesToPosition(coordinates: Coordinates, radius: number): Position;
export declare function tween(from: any, to: any, animationDuration: number, easingFunction: EasingFunction, onUpdate: () => void, onEnd?: () => void): void;

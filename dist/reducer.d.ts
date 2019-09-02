import { Coordinates, FocusOptions, Marker } from './types';
export declare enum ActionType {
    Animate = "ANIMATE",
    SetFocus = "SET_FOCUS",
    SetActiveMarker = "SET_ACTIVE_MANAGER"
}
interface Action {
    type: ActionType;
    payload: any;
}
export interface State {
    activeMarker?: Marker;
    activeMarkerObject?: THREE.Object3D;
    focus?: Coordinates;
    focusOptions: FocusOptions;
}
export default function reducer(state: State, action: Action): State;
export {};

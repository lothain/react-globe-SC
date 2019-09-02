/// <reference types="react" />
import * as types from './types';
export declare type CameraOptions = types.Optional<types.CameraOptions>;
export declare type FocusOptions = types.Optional<types.FocusOptions>;
export declare type GlobeOptions = types.Optional<types.GlobeOptions>;
export declare type LightOptions = types.Optional<types.LightOptions>;
export declare type MarkerOptions = types.Optional<types.MarkerOptions>;
export declare type Animation = types.Animation;
export declare type Coordinates = types.Coordinates;
export declare type EasingFunction = types.EasingFunction;
export declare type InteractionEvent = types.InteractionEvent;
export declare type Interactable = types.Interactable;
export declare type Marker = types.Marker;
export declare type MarkerCallback = types.MarkerCallback;
export declare type MarkerType = types.MarkerType;
export declare type Position = types.Position;
export declare type Size = types.Size;
export interface Props {
    /** An array of animation steps to power globe animations. */
    animations?: Animation[];
    /** Configure camera options (e.g. rotation, zoom, angles). */
    cameraOptions?: CameraOptions;
    /** A set of [lat, lon] coordinates to be focused on. */
    focus?: Coordinates;
    /** Configure focusing options (e.g. animation duration, distance, easing function). */
    focusOptions?: FocusOptions;
    /** Configure globe options (e.g. textures, background, clouds, glow). */
    globeOptions?: GlobeOptions;
    /** Configure light options (e.g. ambient and point light colors + intensity). */
    lightOptions?: LightOptions;
    /** A set of starting [lat, lon] coordinates for the globe. */
    lookAt?: Coordinates;
    /** An array of data that will render interactive markers on the globe. */
    markers?: Marker[];
    /** Configure marker options (e.g. tooltips, size, marker types, custom marker renderer). */
    markerOptions?: MarkerOptions;
    /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
    onClickMarker?: MarkerCallback;
    /** Callback to handle defocus events (i.e. clicking the globe after a focus has been applied).  Captures the previously focused coordinates and pointer event. */
    onDefocus?: (previousFocus: Coordinates, event?: PointerEvent) => void;
    /** Callback to handle mouseout events of a marker.  Captures the previously hovered marker, ThreeJS object and pointer event. */
    onMouseOutMarker?: MarkerCallback;
    /** Callback to handle mouseover events of a marker.  Captures the hovered marker, ThreeJS object and pointer event. */
    onMouseOverMarker?: MarkerCallback;
    /** Callback when texture is successfully loaded */
    onTextureLoaded?: () => void;
    /** Set explicit [width, height] values for the canvas container.  This will disable responsive resizing. */
    size?: Size;
}
declare function ReactGlobe({ animations, cameraOptions, focus: initialFocus, focusOptions: initialFocusOptions, globeOptions, lightOptions, lookAt, markers, markerOptions, onClickMarker, onDefocus, onMouseOutMarker, onMouseOverMarker, onTextureLoaded, size: initialSize, }: Props): JSX.Element;
declare namespace ReactGlobe {
    var defaultProps: {
        animations: any[];
        cameraOptions: types.CameraOptions;
        focusOptions: types.FocusOptions;
        globeOptions: types.GlobeOptions;
        lightOptions: types.LightOptions;
        lookAt: number[];
        markers: any[];
        markerOptions: types.MarkerOptions;
    };
}
export default ReactGlobe;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var TWEEN = require('es6-tween');
var React = require('react');
var React__default = _interopDefault(React);
var reactCachedCallback = require('react-cached-callback');
var three = require('three');
var three_interaction = require('three.interaction');
var OrbitControls = _interopDefault(require('three-orbitcontrols'));
var threeGlowMesh = require('three-glow-mesh');
var d3Array = require('d3-array');
var d3Scale = require('d3-scale');
var ResizeObserver = _interopDefault(require('resize-observer-polyfill'));
var tippy = _interopDefault(require('tippy.js'));

function coordinatesToPosition(coordinates, radius) {
    var lat = coordinates[0], long = coordinates[1];
    var phi = (lat * Math.PI) / 180;
    var theta = ((long - 180) * Math.PI) / 180;
    var x = -radius * Math.cos(phi) * Math.cos(theta);
    var y = radius * Math.sin(phi);
    var z = radius * Math.cos(phi) * Math.sin(theta);
    return [x, y, z];
}
function tween(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
from, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
to, animationDuration, easingFunction, onUpdate, onEnd) {
    new TWEEN.Tween(from)
        .to(to, animationDuration)
        .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
        .on('update', onUpdate)
        .on('complete', onEnd)
        .start();
}

var MarkerType;
(function (MarkerType) {
    MarkerType["Bar"] = "bar";
    MarkerType["Dot"] = "dot";
    MarkerType["Mine"] = "mine";
})(MarkerType || (MarkerType = {}));

// hardcoded constants that can eventually be exposed via options
var RADIUS = 300;
var BACKGROUND_RADIUS_SCALE = 10;
var CAMERA_FAR = RADIUS * 100;
var CAMERA_FOV = 45;
var CAMERA_NEAR = 1;
var CAMERA_DAMPING_FACTOR = 0.1;
var CAMERA_MAX_POLAR_ANGLE = Math.PI;
var CAMERA_MIN_POLAR_ANGLE = 0;
var CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
var CLOUDS_RADIUS_OFFSET = 1;
var GLOBE_SEGMENTS = 50;
var MARKER_DEFAULT_COLOR = 'gold';
var MARKER_SEGMENTS = 10;
var MARKER_UNIT_RADIUS_SCALE = 0.01;
var MARKER_ACTIVE_ANIMATION_DURATION = 100;
var MARKER_ACTIVE_ANIMATION_EASING_FUNCTION = [
    'Cubic',
    'In',
];
var defaultCameraOptions = {
    autoRotateSpeed: 0.02,
    distanceRadiusScale: 3,
    enableAutoRotate: true,
    enableRotate: true,
    enableZoom: true,
    maxDistanceRadiusScale: 4,
    maxPolarAngle: CAMERA_MAX_POLAR_ANGLE,
    minPolarAngle: CAMERA_MIN_POLAR_ANGLE,
    rotateSpeed: 0.02,
    zoomSpeed: 1,
};
var defaultFocusOptions = {
    animationDuration: 1000,
    distanceRadiusScale: 1.5,
    easingFunction: ['Cubic', 'Out'],
    enableDefocus: true,
};
var defaultGlobeOptions = {
    backgroundTexture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/background.png',
    cloudsSpeed: 0.5,
    cloudsOpacity: 0.3,
    cloudsTexture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/clouds.png',
    enableBackground: true,
    enableClouds: true,
    enableGlow: true,
    glowCoefficient: 0.1,
    glowColor: '#d1d1d1',
    glowPower: 3,
    glowRadiusScale: 0.2,
    texture: 'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg',
};
var defaultLightOptions = {
    ambientLightColor: 'white',
    ambientLightIntensity: 0.8,
    pointLightColor: 'white',
    pointLightIntensity: 1,
    pointLightPositionRadiusScales: [-2, 1, -1],
};
var defaultDotMarkerOptions = {
    activeScale: 1.3,
    animationDuration: 1000,
    enableGlow: true,
    enableTooltip: true,
    getTooltipContent: function (marker) { return JSON.stringify(marker.coordinates); },
    glowCoefficient: 0,
    glowPower: 3,
    glowRadiusScale: 2,
    radiusScaleRange: [0.005, 0.02],
    type: MarkerType.Dot,
};
var defaultBarMarkerOptions = {
    activeScale: 1.05,
    animationDuration: 2000,
    enableGlow: false,
    enableTooltip: true,
    getTooltipContent: function (marker) { return JSON.stringify(marker.coordinates); },
    glowCoefficient: 0,
    glowPower: 3,
    glowRadiusScale: 2,
    offsetRadiusScale: 0,
    radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
    type: MarkerType.Bar,
};
var defaultMineMarkerOptions = {
    activeScale: 1.05,
    animationDuration: 2000,
    enableGlow: false,
    enableTooltip: true,
    getTooltipContent: function (marker) { return JSON.stringify(marker.coordinates); },
    glowCoefficient: 0,
    glowPower: 3,
    glowRadiusScale: 2,
    offsetRadiusScale: 0,
    radiusScaleRange: [0.2, defaultFocusOptions.distanceRadiusScale - 1],
    type: MarkerType.Mine,
};
var defaultMarkerOptions = defaultDotMarkerOptions;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function useCamera(_a, _b, _c, rendererRef, size, lookAt, focus) {
    var autoRotateSpeed = _a.autoRotateSpeed, distanceRadiusScale = _a.distanceRadiusScale, enableAutoRotate = _a.enableAutoRotate, enableRotate = _a.enableRotate, enableZoom = _a.enableZoom, maxDistanceRadiusScale = _a.maxDistanceRadiusScale, maxPolarAngle = _a.maxPolarAngle, minPolarAngle = _a.minPolarAngle, rotateSpeed = _a.rotateSpeed, zoomSpeed = _a.zoomSpeed;
    var ambientLightColor = _b.ambientLightColor, ambientLightIntensity = _b.ambientLightIntensity, pointLightColor = _b.pointLightColor, pointLightIntensity = _b.pointLightIntensity, pointLightPositionRadiusScales = _b.pointLightPositionRadiusScales;
    var focusAnimationDuration = _c.animationDuration, focusDistanceRadiusScale = _c.distanceRadiusScale, focusEasingFunction = _c.easingFunction;
    var cameraRef = React.useRef(new three.PerspectiveCamera());
    var ambientLightRef = React.useRef();
    var pointLightRef = React.useRef();
    var orbitControlsRef = React.useRef();
    var preFocusPositionRef = React.useRef();
    var pointLightRadiusScaleX = pointLightPositionRadiusScales[0], pointLightRadiusScaleY = pointLightPositionRadiusScales[1], pointLightRadiusScaleZ = pointLightPositionRadiusScales[2];
    // init
    React.useEffect(function () {
        var camera = cameraRef.current;
        var ambientLight = new three.AmbientLight('white');
        ambientLightRef.current = ambientLight;
        camera.add(ambientLight);
        var pointLight = new three.PointLight('white');
        pointLightRef.current = pointLight;
        camera.add(pointLight);
        orbitControlsRef.current = new OrbitControls(camera, rendererRef.current.domElement);
    }, [rendererRef]);
    // update options
    React.useEffect(function () {
        var _a;
        var camera = cameraRef.current;
        var orbitControls = orbitControlsRef.current;
        var ambientLight = ambientLightRef.current;
        var pointLight = pointLightRef.current;
        camera.far = CAMERA_FAR;
        camera.fov = CAMERA_FOV;
        camera.near = CAMERA_NEAR;
        var position = coordinatesToPosition(lookAt, RADIUS * distanceRadiusScale);
        (_a = camera.position).set.apply(_a, position);
        // apply light options
        ambientLight.color = new three.Color(ambientLightColor);
        ambientLight.intensity = ambientLightIntensity;
        pointLight.color = new three.Color(pointLightColor);
        pointLight.intensity = pointLightIntensity;
        pointLight.position.set(RADIUS * pointLightRadiusScaleX, RADIUS * pointLightRadiusScaleY, RADIUS * pointLightRadiusScaleZ);
        // apply orbit controls options
        orbitControls.enableDamping = true;
        orbitControls.autoRotate = enableAutoRotate;
        orbitControls.autoRotateSpeed = autoRotateSpeed;
        orbitControls.dampingFactor = CAMERA_DAMPING_FACTOR;
        orbitControls.enablePan = false;
        orbitControls.enableRotate = enableRotate;
        orbitControls.enableZoom = enableZoom;
        orbitControls.maxDistance = RADIUS * maxDistanceRadiusScale;
        orbitControls.maxPolarAngle = maxPolarAngle;
        orbitControls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
        orbitControls.minPolarAngle = minPolarAngle;
        orbitControls.rotateSpeed = rotateSpeed;
        orbitControls.zoomSpeed = zoomSpeed;
        orbitControlsRef.current = orbitControls;
    }, [
        ambientLightColor,
        ambientLightIntensity,
        autoRotateSpeed,
        distanceRadiusScale,
        enableAutoRotate,
        enableRotate,
        enableZoom,
        lookAt,
        maxDistanceRadiusScale,
        maxPolarAngle,
        minPolarAngle,
        pointLightColor,
        pointLightIntensity,
        pointLightRadiusScaleX,
        pointLightRadiusScaleY,
        pointLightRadiusScaleZ,
        rotateSpeed,
        zoomSpeed,
    ]);
    // update size
    React.useEffect(function () {
        var camera = cameraRef.current;
        camera.aspect = size[0] / size[1];
        camera.updateProjectionMatrix();
    }, [size]);
    // update focus
    React.useEffect(function () {
        var orbitControls = orbitControlsRef.current;
        var camera = cameraRef.current;
        var preFocusPosition = preFocusPositionRef.current;
        if (focus) {
            // disable orbit controls when focused
            orbitControls.autoRotate = false;
            orbitControls.enabled = false;
            orbitControls.minPolarAngle = CAMERA_MIN_POLAR_ANGLE;
            orbitControls.maxPolarAngle = CAMERA_MAX_POLAR_ANGLE;
            var from_1 = [
                camera.position.x,
                camera.position.y,
                camera.position.z,
            ];
            var to = coordinatesToPosition(focus, RADIUS * focusDistanceRadiusScale);
            preFocusPositionRef.current =
                preFocusPosition || from_1.slice();
            tween(from_1, to, focusAnimationDuration, focusEasingFunction, function () {
                var _a;
                (_a = camera.position).set.apply(_a, from_1);
            });
        }
        else {
            if (preFocusPosition) {
                var from_2 = [
                    camera.position.x,
                    camera.position.y,
                    camera.position.z,
                ];
                var to = preFocusPosition;
                tween(from_2, to, focusAnimationDuration, focusEasingFunction, function () {
                    var _a;
                    (_a = camera.position).set.apply(_a, from_2);
                }, function () {
                    orbitControls.enabled = true;
                    orbitControls.autoRotate = enableAutoRotate;
                    orbitControls.maxPolarAngle = maxPolarAngle;
                    orbitControls.minPolarAngle = minPolarAngle;
                    preFocusPositionRef.current = undefined;
                });
            }
        }
    }, [
        enableAutoRotate,
        focus,
        focusAnimationDuration,
        focusDistanceRadiusScale,
        focusEasingFunction,
        maxPolarAngle,
        minPolarAngle,
    ]);
    return [cameraRef, orbitControlsRef];
}

var SECONDS_TO_MILLISECONDS = 1000;
function useGlobe(_a, onTextureLoaded) {
    var backgroundTexture = _a.backgroundTexture, cloudsOpacity = _a.cloudsOpacity, cloudsSpeed = _a.cloudsSpeed, cloudsTexture = _a.cloudsTexture, enableBackground = _a.enableBackground, enableClouds = _a.enableClouds, enableGlow = _a.enableGlow, glowCoefficient = _a.glowCoefficient, glowColor = _a.glowColor, glowPower = _a.glowPower, glowRadiusScale = _a.glowRadiusScale, texture = _a.texture;
    var globeRef = React.useRef(new three.Group());
    var sphereRef = React.useRef(new three.Mesh());
    var backgroundRef = React.useRef(new three.Mesh());
    var cloudsRef = React.useRef(new three.Mesh());
    // init
    React.useEffect(function () {
        var globe = globeRef.current;
        var sphere = sphereRef.current;
        var background = backgroundRef.current;
        var clouds = cloudsRef.current;
        var cloudsAnimationFrameID;
        // add background if enabled
        if (enableBackground) {
            new three.TextureLoader().load(backgroundTexture, function (map) {
                background.geometry = new three.SphereGeometry(RADIUS * BACKGROUND_RADIUS_SCALE, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
                background.material = new three.MeshBasicMaterial({
                    map: map,
                    side: three.BackSide,
                });
                globe.add(background);
            });
        }
        // add clouds if enabled
        if (enableClouds) {
            new three.TextureLoader().load(cloudsTexture, function (map) {
                clouds.geometry = new three.SphereGeometry(RADIUS + CLOUDS_RADIUS_OFFSET, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
                clouds.material = new three.MeshLambertMaterial({
                    map: map,
                    transparent: true,
                });
                clouds.material.opacity = cloudsOpacity;
                globe.add(clouds);
                function animateClouds() {
                    clouds.rotation.x +=
                        (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
                    clouds.rotation.y +=
                        (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
                    clouds.rotation.z +=
                        (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
                    cloudsAnimationFrameID = requestAnimationFrame(animateClouds);
                }
                animateClouds();
            });
        }
        new three.TextureLoader().load(texture, function (map) {
            sphere.geometry = new three.SphereGeometry(RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
            sphere.material = new three.MeshLambertMaterial({
                map: map,
            });
            globe.add(sphere);
            // add glow if enabled
            if (enableGlow) {
                var glowMesh = threeGlowMesh.createGlowMesh(sphere.geometry, {
                    backside: true,
                    color: glowColor,
                    coefficient: glowCoefficient,
                    power: glowPower,
                    size: RADIUS * glowRadiusScale,
                });
                sphere.children = []; // remove all glow instances
                sphere.add(glowMesh);
            }
            onTextureLoaded && onTextureLoaded();
        });
        return function () {
            if (enableClouds && cloudsAnimationFrameID) {
                cancelAnimationFrame(cloudsAnimationFrameID);
            }
        };
    }, [
        backgroundTexture,
        cloudsOpacity,
        cloudsSpeed,
        cloudsTexture,
        enableBackground,
        enableClouds,
        enableGlow,
        glowCoefficient,
        glowColor,
        glowPower,
        glowRadiusScale,
        onTextureLoaded,
        texture,
    ]);
    return globeRef;
}

function useMarkers(markers, _a, _b) {
    var animationDuration = _a.animationDuration, enableGlow = _a.enableGlow, glowCoefficient = _a.glowCoefficient, glowPower = _a.glowPower, glowRadiusScale = _a.glowRadiusScale, offsetRadiusScale = _a.offsetRadiusScale, radiusScaleRange = _a.radiusScaleRange, renderer = _a.renderer, type = _a.type;
    var onClick = _b.onClick, onMouseOver = _b.onMouseOver;
    var markersRef = React.useRef(new three.Group());
    var unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;
    // init
    React.useEffect(function () {
        var sizeScale = d3Scale.scaleLinear()
            .domain([
            d3Array.min(markers, function (marker) { return marker.value; }),
            d3Array.max(markers, function (marker) { return marker.value; }),
        ])
            .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);
        markersRef.current.children = []; // clear data before adding
        markers.forEach(function (marker) {
            var _a;
            var coordinates = marker.coordinates, value = marker.value;
            var shouldUseCustomMarker = renderer !== undefined;
            var color = marker.color || MARKER_DEFAULT_COLOR;
            var alphaT = new three.TextureLoader().load("../checker.png");
            var size = sizeScale(value);
            var markerObject;
            if (shouldUseCustomMarker) {
                markerObject = renderer(marker);
            }
            else {
                var from_1 = { size: 0 };
                var to_1 = { size: size };
                var mesh_1 = new three.Mesh();
                tween(from_1, to_1, animationDuration, ['Linear', 'None'], function () {
                    switch (type) {
                        case MarkerType.Bar:
                            mesh_1.geometry = new three.BoxGeometry(unitRadius, unitRadius, from_1.size);
                            mesh_1.material = new three.MeshLambertMaterial({
                                color: color,
                                alphaMap: alphaT,
                            });
                            break;
                        case MarkerType.Mine:
                            mesh_1.geometry = new three.PlaneGeometry(to_1.size, to_1.size);
                            mesh_1.material = new three.MeshLambertMaterial({
                                color: color,
                                alphaMap: alphaT,
                            });
                            break;
                        case MarkerType.Dot:
                        default:
                            mesh_1.geometry = new three.SphereGeometry(from_1.size, MARKER_SEGMENTS, MARKER_SEGMENTS);
                            mesh_1.material = new three.MeshBasicMaterial({ color: color });
                            if (enableGlow) {
                                // add glow
                                var glowMesh = threeGlowMesh.createGlowMesh(mesh_1.geometry.clone(), {
                                    backside: false,
                                    color: color,
                                    coefficient: glowCoefficient,
                                    power: glowPower,
                                    size: from_1.size * glowRadiusScale,
                                });
                                mesh_1.children = [];
                                mesh_1.add(glowMesh);
                            }
                    }
                });
                markerObject = mesh_1;
            }
            // place markers
            var heightOffset = 0;
            if (offsetRadiusScale !== undefined) {
                heightOffset = RADIUS * offsetRadiusScale;
            }
            else {
                if (type === MarkerType.Dot) {
                    heightOffset = (size * (1 + glowRadiusScale)) / 2;
                }
                else {
                    heightOffset = 0;
                }
            }
            var position = coordinatesToPosition(coordinates, RADIUS + heightOffset);
            (_a = markerObject.position).set.apply(_a, position);
            markerObject.lookAt(new three.Vector3(0, 0, 0));
            // handle events
            function handleClick(event) {
                event.stopPropagation();
                onClick(marker, markerObject, event.data.originalEvent);
            }
            markerObject.on('click', handleClick);
            markerObject.on('touchstart', handleClick);
            markerObject.on('mousemove', function (event) {
                event.stopPropagation();
                onMouseOver(marker, markerObject, event.data.originalEvent);
            });
            markersRef.current.add(markerObject);
        });
    }, [
        animationDuration,
        enableGlow,
        glowCoefficient,
        glowPower,
        glowRadiusScale,
        markers,
        offsetRadiusScale,
        onClick,
        onMouseOver,
        radiusScaleRange,
        renderer,
        type,
        unitRadius,
    ]);
    return markersRef;
}

function useRenderer(size) {
    var rendererRef = React.useRef();
    var canvasRef = React.useRef();
    // init
    React.useEffect(function () {
        rendererRef.current = new three.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: canvasRef.current,
        });
    }, []);
    // update size
    React.useEffect(function () {
        var _a;
        (_a = rendererRef.current).setSize.apply(_a, size);
    }, [size]);
    return [rendererRef, canvasRef];
}

function useResize(initialSize) {
    var mountRef = React.useRef();
    var _a = React.useState([0, 0]), size = _a[0], setSize = _a[1];
    React.useEffect(function () {
        var mount = mountRef.current;
        // update initial size
        var width = 0;
        var height = 0;
        if (initialSize) {
            // Use initialSize if it is provided
            width = initialSize[0], height = initialSize[1];
        }
        else {
            // Use parentElement size if resized has not updated
            width = mount.offsetWidth;
            height = mount.offsetHeight;
        }
        setSize([width, height]);
        // update resize using a resize observer
        var resizeObserver = new ResizeObserver(function (entries) {
            if (!entries || !entries.length) {
                return;
            }
            if (initialSize === undefined) {
                var _a = entries[0].contentRect, width_1 = _a.width, height_1 = _a.height;
                setSize([width_1, height_1]);
            }
        });
        resizeObserver.observe(mount);
        return function () {
            resizeObserver.unobserve(mount);
        };
    }, [initialSize]);
    return [mountRef, size];
}

var ActionType;
(function (ActionType) {
    ActionType["Animate"] = "ANIMATE";
    ActionType["SetFocus"] = "SET_FOCUS";
    ActionType["SetActiveMarker"] = "SET_ACTIVE_MANAGER";
})(ActionType || (ActionType = {}));
function reducer(state, action) {
    var payload = action.payload, type = action.type;
    switch (type) {
        case ActionType.Animate:
            return __assign(__assign({}, state), { activeMarker: undefined, activeMarkerObject: undefined, focus: payload.focus, focusOptions: payload.focusOptions });
        case ActionType.SetFocus:
            return __assign(__assign({}, state), { activeMarker: undefined, activeMarkerObject: undefined, focus: payload.focus, focusOptions: payload.focusOptions || state.focusOptions });
        case ActionType.SetActiveMarker:
            return __assign(__assign({}, state), { activeMarker: payload.marker, activeMarkerObject: payload.markerObject });
        default:
            return state;
    }
}

var useEffect = React__default.useEffect, useRef = React__default.useRef;
var tooltipInstance;
function Tooltip(_a) {
    var content = _a.content, offset = _a.offset, x = _a.x, y = _a.y;
    var ref = useRef();
    useEffect(function () {
        document.body.style.cursor = 'pointer';
        tooltipInstance = tippy(ref.current, {
            animation: 'scale',
            content: content,
        });
        tooltipInstance.show();
        return function () {
            document.body.style.cursor = 'inherit';
            if (tooltipInstance) {
                tooltipInstance.destroy();
            }
        };
    }, [content]);
    return (React__default.createElement("div", { ref: ref, style: {
            left: x + offset,
            position: 'fixed',
            top: y + offset,
        } }));
}

function ReactGlobe(_a) {
    var animations = _a.animations, cameraOptions = _a.cameraOptions, initialFocus = _a.focus, initialFocusOptions = _a.focusOptions, globeOptions = _a.globeOptions, lightOptions = _a.lightOptions, lookAt = _a.lookAt, markers = _a.markers, markerOptions = _a.markerOptions, onClickMarker = _a.onClickMarker, onDefocus = _a.onDefocus, onMouseOutMarker = _a.onMouseOutMarker, onMouseOverMarker = _a.onMouseOverMarker, onTextureLoaded = _a.onTextureLoaded, initialSize = _a.size;
    // merge options with defaults to support incomplete options
    var mergedGlobeOptions = __assign(__assign({}, defaultGlobeOptions), globeOptions);
    var mergedCameraOptions = __assign(__assign({}, defaultCameraOptions), cameraOptions);
    var mergedLightOptions = __assign(__assign({}, defaultLightOptions), lightOptions);
    var mergedFocusOptions = __assign(__assign({}, defaultFocusOptions), initialFocusOptions);
    var mergedMarkerOptions = __assign(__assign({}, defaultMarkerOptions), markerOptions);
    var _b = React.useReducer(reducer, {
        focus: initialFocus,
        focusOptions: mergedFocusOptions,
    }), state = _b[0], dispatch = _b[1];
    var activeMarker = state.activeMarker, activeMarkerObject = state.activeMarkerObject, focus = state.focus, focusOptions = state.focusOptions;
    var enableDefocus = focusOptions.enableDefocus;
    var activeScale = mergedMarkerOptions.activeScale, enableTooltip = mergedMarkerOptions.enableTooltip, getTooltipContent = mergedMarkerOptions.getTooltipContent;
    // cache event handlers
    var handleClickMarker = reactCachedCallback.useEventCallback(function (marker, markerObject, event) {
        dispatch({
            type: ActionType.SetFocus,
            payload: {
                focus: marker.coordinates,
            },
        });
        onClickMarker && onClickMarker(marker, markerObject, event);
    });
    var handleMouseOutMarker = reactCachedCallback.useEventCallback(function (marker, markerObject, event) {
        dispatch({
            type: ActionType.SetActiveMarker,
            payload: {
                activeMarker: undefined,
                activeMarkerObject: undefined,
            },
        });
        var from = [
            activeScale,
            activeScale,
            activeScale,
        ];
        tween(from, [1, 1, 1], MARKER_ACTIVE_ANIMATION_DURATION, MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, function () {
            var _a;
            if (activeMarkerObject) {
                (_a = activeMarkerObject.scale).set.apply(_a, from);
            }
        });
        onMouseOutMarker && onMouseOutMarker(marker, activeMarkerObject, event);
    });
    var handleMouseOverMarker = reactCachedCallback.useEventCallback(function (marker, markerObject, event) {
        dispatch({
            type: ActionType.SetActiveMarker,
            payload: {
                marker: marker,
                markerObject: markerObject,
            },
        });
        var from = markerObject.scale.toArray();
        tween(from, [activeScale, activeScale, activeScale], MARKER_ACTIVE_ANIMATION_DURATION, MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, function () {
            var _a;
            if (markerObject) {
                (_a = markerObject.scale).set.apply(_a, from);
            }
        });
        onMouseOverMarker && onMouseOverMarker(marker, markerObject, event);
    });
    var handleDefocus = reactCachedCallback.useEventCallback(function (event) {
        if (focus && enableDefocus) {
            dispatch({
                type: ActionType.SetFocus,
                payload: {
                    focus: undefined,
                },
            });
            onDefocus && onDefocus(focus, event);
        }
    });
    // initialize THREE instances
    var _c = useResize(initialSize), mountRef = _c[0], size = _c[1];
    var _d = useRenderer(size), rendererRef = _d[0], canvasRef = _d[1];
    var globeRef = useGlobe(mergedGlobeOptions, onTextureLoaded);
    var _e = useCamera(mergedCameraOptions, mergedLightOptions, focusOptions, rendererRef, size, lookAt, focus), cameraRef = _e[0], orbitControlsRef = _e[1];
    var markersRef = useMarkers(markers, mergedMarkerOptions, {
        onClick: handleClickMarker,
        onMouseOver: handleMouseOverMarker,
    });
    var mouseRef = React.useRef();
    // track mouse position
    React.useEffect(function () {
        function onMouseUpdate(e) {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        }
        document.addEventListener('mousemove', onMouseUpdate, false);
        return function () {
            document.removeEventListener('mousemove', onMouseUpdate, false);
        };
    }, []);
    // update state from props
    React.useEffect(function () {
        dispatch({
            type: ActionType.SetFocus,
            payload: {
                focus: initialFocus,
                focusOptions: __assign(__assign({}, defaultFocusOptions), initialFocusOptions),
            },
        });
    }, [initialFocus, initialFocusOptions]);
    // handle animations
    React.useEffect(function () {
        var wait = 0;
        var timeouts = [];
        animations.forEach(function (animation) {
            var animationDuration = animation.animationDuration, coordinates = animation.coordinates, distanceRadiusScale = animation.distanceRadiusScale, easingFunction = animation.easingFunction;
            var timeout = setTimeout(function () {
                dispatch({
                    type: ActionType.Animate,
                    payload: {
                        focus: coordinates,
                        focusOptions: {
                            animationDuration: animationDuration,
                            distanceRadiusScale: distanceRadiusScale,
                            easingFunction: easingFunction,
                        },
                    },
                });
            }, wait);
            timeouts.push(timeout);
            wait += animationDuration;
        });
        return function () {
            timeouts.forEach(function (timeout) {
                clearTimeout(timeout);
            });
        };
    }, [animations]);
    // handle scene and rendering loop
    React.useEffect(function () {
        var mount = mountRef.current;
        var renderer = rendererRef.current;
        var globe = globeRef.current;
        var camera = cameraRef.current;
        var animationFrameID;
        // create scene
        var scene = new three.Scene();
        globe.add(markersRef.current);
        scene.add(camera);
        scene.add(globe);
        mount.appendChild(renderer.domElement);
        // initialize interaction events
        new three_interaction.Interaction(renderer, scene, camera);
        scene.on('mousemove', function (event) {
            if (activeMarker) {
                handleMouseOutMarker(activeMarker, activeMarkerObject, event.data.originalEvent);
            }
        });
        if (enableDefocus && focus) {
            scene.on('click', function (event) {
                handleDefocus(event.data.originalEvent);
            });
        }
        function animate() {
            renderer.render(scene, cameraRef.current);
            TWEEN.update();
            orbitControlsRef.current.update();
            animationFrameID = requestAnimationFrame(animate);
        }
        animate();
        return function () {
            if (animationFrameID) {
                cancelAnimationFrame(animationFrameID);
            }
            mount.removeChild(renderer.domElement);
        };
    }, [
        activeMarker,
        activeMarkerObject,
        cameraRef,
        enableDefocus,
        focus,
        globeRef,
        handleDefocus,
        handleMouseOutMarker,
        markersRef,
        mountRef,
        orbitControlsRef,
        rendererRef,
    ]);
    return (React__default.createElement("div", { ref: mountRef, style: { height: '100%', width: '100%' } },
        React__default.createElement("canvas", { ref: canvasRef, style: { display: 'block' } }),
        enableTooltip && activeMarker && (React__default.createElement(Tooltip, { offset: 10, x: mouseRef.current.x, y: mouseRef.current.y, content: getTooltipContent(activeMarker) }))));
}
ReactGlobe.defaultProps = {
    animations: [],
    cameraOptions: defaultCameraOptions,
    focusOptions: defaultFocusOptions,
    globeOptions: defaultGlobeOptions,
    lightOptions: defaultLightOptions,
    lookAt: [1.3521, 103.8198],
    markers: [],
    markerOptions: defaultMarkerOptions,
};

exports.BACKGROUND_RADIUS_SCALE = BACKGROUND_RADIUS_SCALE;
exports.CAMERA_DAMPING_FACTOR = CAMERA_DAMPING_FACTOR;
exports.CAMERA_FAR = CAMERA_FAR;
exports.CAMERA_FOV = CAMERA_FOV;
exports.CAMERA_MAX_POLAR_ANGLE = CAMERA_MAX_POLAR_ANGLE;
exports.CAMERA_MIN_DISTANCE_RADIUS_SCALE = CAMERA_MIN_DISTANCE_RADIUS_SCALE;
exports.CAMERA_MIN_POLAR_ANGLE = CAMERA_MIN_POLAR_ANGLE;
exports.CAMERA_NEAR = CAMERA_NEAR;
exports.CLOUDS_RADIUS_OFFSET = CLOUDS_RADIUS_OFFSET;
exports.GLOBE_SEGMENTS = GLOBE_SEGMENTS;
exports.MARKER_ACTIVE_ANIMATION_DURATION = MARKER_ACTIVE_ANIMATION_DURATION;
exports.MARKER_ACTIVE_ANIMATION_EASING_FUNCTION = MARKER_ACTIVE_ANIMATION_EASING_FUNCTION;
exports.MARKER_DEFAULT_COLOR = MARKER_DEFAULT_COLOR;
exports.MARKER_SEGMENTS = MARKER_SEGMENTS;
exports.MARKER_UNIT_RADIUS_SCALE = MARKER_UNIT_RADIUS_SCALE;
exports.RADIUS = RADIUS;
exports.coordinatesToPosition = coordinatesToPosition;
exports.default = ReactGlobe;
exports.defaultBarMarkerOptions = defaultBarMarkerOptions;
exports.defaultCameraOptions = defaultCameraOptions;
exports.defaultDotMarkerOptions = defaultDotMarkerOptions;
exports.defaultFocusOptions = defaultFocusOptions;
exports.defaultGlobeOptions = defaultGlobeOptions;
exports.defaultLightOptions = defaultLightOptions;
exports.defaultMarkerOptions = defaultMarkerOptions;
exports.defaultMineMarkerOptions = defaultMineMarkerOptions;
exports.tween = tween;

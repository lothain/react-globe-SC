import { max, min, thresholdFreedmanDiaconis } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useEffect, useRef } from 'react';
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  Vector3,
  TextureLoader,
  DoubleSide,
  ShapeBufferGeometry,
  Color,
} from 'three';
import SVGLoader from 'three-svg-loader';
import { createGlowMesh } from 'three-glow-mesh';
import {
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from '../defaults';
import {
  InteractableObject3D,
  InteractionEvent,
  Marker,
  MarkerCallback,
  MarkerOptions,
  MarkerType,
} from '../types';
import { coordinatesToPosition, tween } from '../utils';

interface Handlers {
  onClick: MarkerCallback;
  onMouseOver: MarkerCallback;
}

export default function useMarkers<T>(
  markers: Marker[],
  {
    animationDuration,
    enableGlow,
    glowCoefficient,
    glowPower,
    glowRadiusScale,
    offsetRadiusScale,
    radiusScaleRange,
    renderer,
    type,
  }: MarkerOptions,
  { onClick, onMouseOver }: Handlers,
): React.RefObject<THREE.Group> {
  const markersRef = useRef<THREE.Group>(new Group());
  const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;

  // init
  useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([
        min(markers, marker => marker.value),
        max(markers, marker => marker.value),
      ])
      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

    markersRef.current.children = []; // clear data before adding
    markers.forEach(marker => {
      const { coordinates, value } = marker;
      const shouldUseCustomMarker = renderer !== undefined;

      const color = marker.color || MARKER_DEFAULT_COLOR;
      const alphaT = new TextureLoader().load("../test_b_check.jpg")
      const size = sizeScale(value);
      let markerObject: InteractableObject3D;

      if (shouldUseCustomMarker) {
        markerObject = renderer(marker);
      } else {
        let from = { size: 0 };
        const to = { size };
        const mesh = new Mesh();
        var meshGroup = new Group();
        tween(from, to, animationDuration, ['Linear', 'None'], () => {
          switch (type) {
            case MarkerType.Bar:
              mesh.geometry = new BoxGeometry(
                unitRadius,
                unitRadius,
                from.size,
              );
              mesh.material = new MeshLambertMaterial({
                color,
                alphaMap: alphaT,
              });
              markerObject = mesh;
              break;
            case MarkerType.Mine:
                var guiData = {
                  currentURL: 'models/svg/tiger.svg',
                  drawFillShapes: true,
                  drawStrokes: true,
                  fillShapesWireframe: false,
                  strokesWireframe: false
                };
                var loader = new SVGLoader();
                loader.load( './mining-king-no-tools.svg', function ( data ) {
                  var paths = data.paths;
                  var meshGroup = new Group();
                  meshGroup.scale.multiplyScalar( 0.25 );
                  meshGroup.position.x = - 70;
                  meshGroup.position.y = 70;
                  meshGroup.scale.y *= - 1;
                  for ( var i = 0; i < paths.length; i ++ ) {
                    var path = paths[ i ];
                    var fillColor = path.userData.style.fill;
                    if ( guiData.drawFillShapes && fillColor !== undefined && fillColor !== 'none' ) {
                      var material = new MeshBasicMaterial( {
                        color: new Color().setStyle( fillColor ),
                        opacity: path.userData.style.fillOpacity,
                        transparent: path.userData.style.fillOpacity < 1,
                        side: DoubleSide,
                        depthWrite: false,
                      } );
                      var shapes = path.toShapes( true );
                      for ( var j = 0; j < shapes.length; j ++ ) {
                        var shape = shapes[ j ];
                        var geometry = new ShapeBufferGeometry( shape );
                        var mesh = new Mesh( geometry, material );
                        meshGroup.add( mesh );
                      }
                    }
                    var strokeColor = path.userData.style.stroke;
                    if ( guiData.drawStrokes && strokeColor !== undefined && strokeColor !== 'none' ) {
                      var material = new MeshBasicMaterial( {
                        color: new Color().setStyle( strokeColor ),
                        opacity: path.userData.style.strokeOpacity,
                        transparent: path.userData.style.strokeOpacity < 1,
                        side: DoubleSide,
                        depthWrite: false,
                        wireframe: guiData.strokesWireframe
                      } );
                      for ( var j = 0, jl = path.subPaths.length; j < jl; j ++ ) {
                        var subPath = path.subPaths[ j ];
                        var geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );
                        if ( geometry ) {
                          var mesh = new Mesh( geometry, material );
                          meshGroup.add( mesh );
                        }
                      }
                    }
                  }
                } );
                markerObject = meshGroup;
                  break;
            case MarkerType.Dot:
            default:
              mesh.geometry = new SphereGeometry(
                from.size,
                MARKER_SEGMENTS,
                MARKER_SEGMENTS,
              );
              mesh.material = new MeshBasicMaterial({ color });
              if (enableGlow) {
                // add glow
                const glowMesh = createGlowMesh(
                  mesh.geometry.clone() as THREE.Geometry,
                  {
                    backside: false,
                    color,
                    coefficient: glowCoefficient,
                    power: glowPower,
                    size: from.size * glowRadiusScale,
                  },
                );
                mesh.children = [];
                mesh.add(glowMesh);
              }
              markerObject = mesh;
          }
        });
      }

      // place markers
      let heightOffset = 0;
      if (offsetRadiusScale !== undefined) {
        heightOffset = RADIUS * offsetRadiusScale;
      } else {
        if (type === MarkerType.Dot) {
          heightOffset = (size * (1 + glowRadiusScale)) / 2;
        } else {
          heightOffset = 0;
        }
      }
      const position = coordinatesToPosition(
        coordinates,
        RADIUS + heightOffset,
      );
      markerObject.position.set(...position);
      markerObject.lookAt(new Vector3(0, 0, 0));

      // handle events
      function handleClick(event: InteractionEvent) {
        event.stopPropagation();
        onClick(marker, markerObject, event.data.originalEvent);
      }
      markerObject.on('click', handleClick);
      markerObject.on('touchstart', handleClick);
      markerObject.on('mousemove', event => {
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

import {
  Group,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  ShapeBufferGeometry,
  Color,
} from 'three';
import SVGLoader from 'three-svg-loader';

var guiData = {
  drawFillShapes: true,
  drawStrokes: true,
  fillShapesWireframe: false,
  strokesWireframe: false
};

export default function loadSVG( url ) {
var loader = new SVGLoader;
var meshGroup = new Group;
var urlGiven = url
loader.load( urlGiven, function (data) {
  var paths = data.paths;
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
}
 );
return meshGroup;
};

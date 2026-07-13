import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { glassContainerStyle, pillButtonStyle, standaloneGlassButtonStyle } from '../../styles/glassOverlay'

mapboxgl.accessToken = 'pk.eyJ1IjoiZnV0ZSIsImEiOiJjbW13MjhkaTEyZXR5MnlyMDVzcTVhNGZxIn0.XHTM19z4oKnjjYByGfKnyw'

// The mapbox custom layer below attaches ad-hoc THREE.js state (camera, scene, meshes,
// animation progress) directly onto the layer object at runtime, so it needs an index
// signature wider than mapboxgl.CustomLayerInterface's static shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ShowroomLayer = mapboxgl.CustomLayerInterface & Record<string, any>

const LNT_HQ = { center: [72.83543943405651, 19.010840597088777] as [number, number], zoom: 15.5, pitch: 70, bearing: 2 };

const LOCATIONS: Record<string, { name: string, center: [number, number], zoom: number, pitch: number, bearing: number }> = {
  kamla: { name: "Kamla Mills", center: [72.82955985216928, 19.002252597919142], zoom: 16.0, pitch: 60, bearing: -15 },
  prabhadevi: { name: "Prabhadevi & Parel", center: [72.83605142649256, 19.007504471127593], zoom: 16.0, pitch: 55, bearing: 0 },
  coastal: { name: "Coastal Road & Sea Link", center: [72.82514499716937, 19.043758513106685], zoom: 15.5, pitch: 55, bearing: 15 },
  bkc: { name: "BKC", center: [72.86849067998688, 19.069068137622452], zoom: 15.5, pitch: 50, bearing: 10 },
  airport: { name: "Mumbai Airport", center: [72.85274359796816, 19.096568479733534], zoom: 15.5, pitch: 45, bearing: -20 },
  freeway: { name: "Eastern Freeway", center: [72.87145033783267, 19.013141468896244], zoom: 16.0, pitch: 50, bearing: -30 },
  expressway: { name: "Eastern Express Hwy", center: [72.9226949541333, 19.08617418212713], zoom: 15.5, pitch: 45, bearing: 10 },
  atal: { name: "Atal Setu", center: [72.95437612362463, 18.991523944658983], zoom: 15.5, pitch: 45, bearing: 45 },
  navi_airport: { name: "Navi Mumbai Airport", center: [73.03699566890366, 18.9884549299255], zoom: 15.5, pitch: 40, bearing: 30 }
}

const CIRCULATION_PATH = [
  [72.83655358142, 19.01238741590967],
  [72.83532074575494, 19.01103542998819],
  [72.83606504752488, 19.01025282347673],
  [72.83597708459138, 19.010156863298104],
  [72.83514707531464, 19.010869099745985],
  [72.83384455041819, 19.009526907888123]
];

export default function InteractiveMapView({ onClose }: { onClose: () => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const drawFlightPathRef = useRef<((targetKey: string | null) => void) | null>(null)

  const toggleCirculationRef = useRef<((show: boolean) => void) | null>(null)

  const [activeTab, setActiveTab] = useState<string>('hq')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isCirculationActive, setIsCirculationActive] = useState<boolean>(false)
  const [isResetHovered, setIsResetHovered] = useState<boolean>(false)
  const [isBackHovered, setIsBackHovered] = useState<boolean>(false)
  const [isCirculationHovered, setIsCirculationHovered] = useState<boolean>(false)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Retina/high-DPI screens push this 3D building + custom THREE scene to 2-3x
    // resolution, which is the single biggest cost in this view. Capping the ratio
    // Mapbox reads at construction time cuts fragment-shader work substantially
    // with only a minor, hard-to-notice softening of edges.
    const originalDevicePixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')
    const cappedRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    if (cappedRatio < (window.devicePixelRatio || 1)) {
      Object.defineProperty(window, 'devicePixelRatio', { value: cappedRatio, configurable: true })
    }

    const mapOrigin = LNT_HQ.center
    const modelAltitude = 0
    const modelAsMercator = mapboxgl.MercatorCoordinate.fromLngLat(mapOrigin, modelAltitude)

    const modelTransform = {
      translateX: modelAsMercator.x,
      translateY: modelAsMercator.y,
      translateZ: modelAsMercator.z,
      scale: modelAsMercator.meterInMercatorCoordinateUnits()
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: mapOrigin,
      zoom: 12,
      pitch: 0,
      bearing: 180,
      interactive: true,
      antialias: false,
      fadeDuration: 0,
      refreshExpiredTiles: false
    })

    mapInstanceRef.current = map

    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes pulseMarker {
        0% { box-shadow: 0 0 0 0 rgba(4, 81, 206, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      @keyframes parelSequence {
        0% { opacity: 0; }
        45% { opacity: 0; }
        55% { opacity: 1; }
        85% { opacity: 1; }
        95% { opacity: 0; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);

    const parelEl = document.createElement('div');
    parelEl.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; animation: parelSequence 10s forwards;">
        <div style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 2px solid #ffffff; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); white-space: nowrap; margin-bottom: 6px;">
          🚆 PAREL STATION
        </div>
        <div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 20px rgba(59, 130, 246, 1); animation: pulseMarker 1.5s infinite;"></div>
      </div>
    `;
    const parelMarker = new mapboxgl.Marker(parelEl)
      .setLngLat([72.83739641025635, 19.009117545234737])
      .addTo(map);

    const elphinstoneEl = document.createElement('div');
    elphinstoneEl.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; animation: parelSequence 10s forwards;">
        <div style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 2px solid #ffffff; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); white-space: nowrap; margin-bottom: 6px;">
          🌉 ELPHINSTONE BRIDGE
        </div>
        <div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 20px rgba(59, 130, 246, 1); animation: pulseMarker 1.5s infinite;"></div>
      </div>
    `;
    const elphinstoneMarker = new mapboxgl.Marker(elphinstoneEl)
      .setLngLat([72.83153987433055, 19.0065666153384])
      .addTo(map);

    const siddhivinayakEl = document.createElement('div');
    siddhivinayakEl.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; animation: parelSequence 10s forwards;">
        <div style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 2px solid #ffffff; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); white-space: nowrap; margin-bottom: 6px;">
          🛕 SHREE SIDDHIVINAYAK TEMPLE
        </div>
        <div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 20px rgba(59, 130, 246, 1); animation: pulseMarker 1.5s infinite;"></div>
      </div>
    `;
    const siddhivinayakMarker = new mapboxgl.Marker(siddhivinayakEl)
      .setLngLat([72.83041535413224, 19.01691320905886])
      .addTo(map);

    setTimeout(() => {
      parelMarker.remove();
      elphinstoneMarker.remove();
      siddhivinayakMarker.remove();
    }, 10500);

    const customLayer: ShowroomLayer = {
      id: '3d-showroom',
      type: 'custom',
      renderingMode: '3d',

      onAdd: function (mapInstance, gl) {
        this.camera = new THREE.Camera()
        this.scene = new THREE.Scene()

        this.scene.add(new THREE.AmbientLight(0xffffff, 2.5))
        const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight.position.set(0, 40, -40)
        this.scene.add(directionalLight)

        const gltfLoader = new GLTFLoader()

        const loadCustomModel = (fileName: string, pos: [number, number, number], scale: number, spinRotation: number, hexColor: number | null) => {
          gltfLoader.load(fileName, (gltf) => {
            const model = gltf.scene
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (hexColor !== null) {
                  child.material = new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.5, metalness: 0.1 })
                }
                child.castShadow = true
                child.receiveShadow = true
              }
            })
            model.scale.set(scale, scale, scale)
            model.position.set(pos[0], pos[1], pos[2])
            model.rotation.x = Math.PI / 2;
            model.rotation.y = spinRotation;
            this.scene.add(model)
          })
        }

        loadCustomModel('/buildings/LNT.glb', [55, 30, 150], 150, 0.8, null)

        const routeGroup = new THREE.Group();
        routeGroup.rotation.x = Math.PI / 2;
        this.scene.add(routeGroup);

        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF5F1F });
        const routeMesh = new THREE.Mesh(new THREE.BufferGeometry(), tubeMaterial);
        routeMesh.frustumCulled = false;
        routeGroup.add(routeMesh);

        this.routeMesh = routeMesh;
        this.routeIndicesTotal = 0;
        this.routeIndicesDrawn = 0;

        const circGroup = new THREE.Group();
        circGroup.rotation.x = Math.PI / 2;
        this.scene.add(circGroup);

        const circTubeMat = new THREE.MeshBasicMaterial({ color: 0xFF5F1F, transparent: true, opacity: 0 });
        this.circMesh = new THREE.Mesh(new THREE.BufferGeometry(), circTubeMat);
        this.circMesh.frustumCulled = false;
        circGroup.add(this.circMesh);

        const dotGeo = new THREE.SphereGeometry(6, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0 });
        this.circDotMesh = new THREE.Mesh(dotGeo, dotMat);
        this.circDotMesh.frustumCulled = false;
        circGroup.add(this.circDotMesh);

        const circPoints3D = CIRCULATION_PATH.map((coord) => {
          const targetMerc = mapboxgl.MercatorCoordinate.fromLngLat(coord as [number, number], 0);
          const targetX = (targetMerc.x - modelAsMercator.x) / modelTransform.scale;
          const targetZ = (targetMerc.y - modelAsMercator.y) / modelTransform.scale;
          return new THREE.Vector3(targetX, 5, targetZ);
        });

        const sharpCurvePath = new THREE.CurvePath();
        for (let i = 0; i < circPoints3D.length - 1; i++) {
          sharpCurvePath.add(new THREE.LineCurve3(circPoints3D[i], circPoints3D[i + 1]));
        }
        this.circCurve = sharpCurvePath;

        this.isCirculating = false;
        this.circProgress = 0;

        drawFlightPathRef.current = async (targetKey) => {
          if (markerRef.current) markerRef.current.remove();

          if (this.routeMesh.geometry) {
            this.routeMesh.geometry.dispose();
            this.routeMesh.geometry = new THREE.BufferGeometry();
          }

          this.routeIndicesTotal = 0;
          this.routeIndicesDrawn = 0;

          if (!targetKey) return;

          const targetData = LOCATIONS[targetKey];
          const targetLngLat = targetData.center;

          try {
            const response = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${LNT_HQ.center[0]},${LNT_HQ.center[1]};${targetLngLat[0]},${targetLngLat[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
              const coordinates = data.routes[0].geometry.coordinates;
              const durationMinutes = Math.round(data.routes[0].duration / 60);

              const points3D = coordinates.map((coord: [number, number]) => {
                const targetMerc = mapboxgl.MercatorCoordinate.fromLngLat(coord, 0);
                const targetX = (targetMerc.x - modelAsMercator.x) / modelTransform.scale;
                const targetZ = (targetMerc.y - modelAsMercator.y) / modelTransform.scale;
                return new THREE.Vector3(targetX, 5, targetZ);
              });

              const smoothCurve = new THREE.CatmullRomCurve3(points3D);
              const tubeGeometry = new THREE.TubeGeometry(smoothCurve, 250, 4, 8, false);

              this.routeMesh.geometry = tubeGeometry;
              this.routeIndicesTotal = tubeGeometry.index ? tubeGeometry.index.count : tubeGeometry.attributes.position.count;
              this.routeIndicesDrawn = 0;
              this.routeMesh.geometry.setDrawRange(0, 0);

              const el = document.createElement('div');
              el.innerHTML = `
                <div style="background: #111827; color: white; padding: 8px 16px; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; border: 2px solid #ef4444; white-space: nowrap;">
                  <span>${targetData.name}</span>
                  <span style="font-size: 11px; color: #ef4444; margin-top: 2px;">ETA: ${durationMinutes} MINS</span>
                  <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-top: 8px; border: 2px solid white;"></div>
                </div>
              `;

              markerRef.current = new mapboxgl.Marker(el, { offset: [0, -25] })
                .setLngLat(targetLngLat)
                .addTo(mapInstanceRef.current!);
            }
          } catch (error) {
            console.error("Failed to fetch directions:", error);
          }
        }

        toggleCirculationRef.current = (show: boolean) => {
          this.isCirculating = show;

          if (show) {
            this.circProgress = 0;

            const tubeGeometry = new THREE.TubeGeometry(this.circCurve, 300, 3, 8, false);
            this.circMesh.geometry = tubeGeometry;
            this.circIndicesTotal = tubeGeometry.index ? tubeGeometry.index.count : tubeGeometry.attributes.position.count;
            this.circMesh.geometry.setDrawRange(0, 0);

            mapInstance.triggerRepaint();
          } else {
            this.circDotMesh.material.opacity = 0;
            this.circMesh.material.opacity = 0;
            mapInstance.triggerRepaint();
          }
        }

        this.renderer = new THREE.WebGLRenderer({
          canvas: mapInstance.getCanvas(),
          context: gl,
          antialias: true
        })
        this.renderer.autoClear = false
      },

      render: function (_gl, matrix) {
        const m = new THREE.Matrix4().fromArray(matrix)
        const l = new THREE.Matrix4()
          .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
          .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))

        this.camera.projectionMatrix = m.multiply(l)

        let needsRepaint = false;

        if (this.routeMesh && this.routeMesh.geometry && this.routeIndicesTotal > 0) {
          if (this.routeIndicesDrawn < this.routeIndicesTotal) {
            this.routeIndicesDrawn += 800;
            this.routeMesh.geometry.setDrawRange(0, this.routeIndicesDrawn);
            needsRepaint = true;
          }
        }

        if (this.isCirculating && this.circCurve && this.circDotMesh && this.circMesh) {
          this.circProgress += 0.006;

          if (this.circProgress >= 1) {
            this.circProgress = 0;
          }

          const pointOnCurve = this.circCurve.getPointAt(this.circProgress);
          this.circDotMesh.position.copy(pointOnCurve);

          const drawCount = Math.floor(this.circIndicesTotal * this.circProgress);
          this.circMesh.geometry.setDrawRange(0, drawCount);

          let currentOpacity = 1;
          if (this.circProgress < 0.1) {
            currentOpacity = this.circProgress / 0.1;
          } else if (this.circProgress > 0.9) {
            currentOpacity = (1.0 - this.circProgress) / 0.1;
          }

          this.circDotMesh.material.opacity = currentOpacity;
          this.circMesh.material.opacity = currentOpacity * 0.7;

          needsRepaint = true;
        }

        this.renderer.resetState()
        this.renderer.render(this.scene, this.camera)

        if (needsRepaint) {
          map.triggerRepaint()
        }
      }
    }

    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'lightPreset', 'dusk');

      const layers = map.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.type === 'symbol' || layer.id.includes('poi') || layer.id.includes('medical') || layer.id.includes('landmark')) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      map.addSource('raw-streets', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'
      });

      map.addLayer({
        id: 'enhanced-greenery',
        type: 'fill',
        slot: 'bottom',
        source: 'raw-streets',
        'source-layer': 'landuse',
        filter: ['match', ['get', 'class'], ['park', 'pitch', 'grass', 'golf_course', 'cemetery', 'garden'], true, false],
        paint: {
          'fill-color': '#16a34a',
          'fill-opacity': 0.4
        }
      });

      map.addLayer(customLayer);

      // Wait for the base style + greenery layer to finish their first paint
      // before starting the flyTo — kicking it off immediately competes with
      // tile loading on the main thread and reads as stutter.
      map.once('idle', () => {
        setIsMapReady(true)
        map.flyTo({
          center: LNT_HQ.center,
          zoom: LNT_HQ.zoom,
          pitch: LNT_HQ.pitch,
          bearing: LNT_HQ.bearing,
          duration: 6000,
          essential: true
        });
      })
    })

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
      map.remove();
      if (originalDevicePixelRatio) {
        Object.defineProperty(window, 'devicePixelRatio', originalDevicePixelRatio)
      } else {
        delete (window as unknown as Record<string, unknown>).devicePixelRatio
      }
    }
  }, [])

  const handleFlyTo = (key: string) => {
    setActiveTab(key)

    if (key === 'hq') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: LNT_HQ.center, zoom: LNT_HQ.zoom, pitch: LNT_HQ.pitch, bearing: LNT_HQ.bearing, duration: 7500, essential: true
        })
      }
      if (drawFlightPathRef.current) drawFlightPathRef.current(null);
    } else {
      const target = LOCATIONS[key]
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: target.center, zoom: target.zoom, pitch: target.pitch, bearing: target.bearing, duration: 7500, essential: true
        })
      }
      if (drawFlightPathRef.current) drawFlightPathRef.current(key);
    }
  }

  const handleCirculationToggle = () => {
    const newState = !isCirculationActive;
    setIsCirculationActive(newState);
    if (toggleCirculationRef.current) {
      toggleCirculationRef.current(newState);
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0d12' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Masks the initial style/tile/model load so the first paint doesn't read as stutter */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0d12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isMapReady ? 0 : 1,
          pointerEvents: isMapReady ? 'none' : 'auto',
          transition: 'opacity 0.6s ease',
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 239, 168, 0.2)',
            borderTopColor: '#FFEFA8',
            animation: 'locationMapSpin 0.9s linear infinite',
          }}
        />
        <style>{'@keyframes locationMapSpin { to { transform: rotate(360deg); } }'}</style>
      </div>

      {/* BOTTOM CENTER — circulation toggle stacked above the location nav bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleCirculationToggle}
          onMouseEnter={() => setIsCirculationHovered(true)}
          onMouseLeave={() => setIsCirculationHovered(false)}
          style={standaloneGlassButtonStyle(isCirculationActive, isCirculationHovered)}
        >
          {isCirculationActive ? 'Hide Circulation' : 'Show Circulation'}
        </button>

        <div
          style={{
            width: 'fit-content',
            maxWidth: '98vw',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            gap: '2px',
            padding: '3px',
            ...glassContainerStyle,
          }}
        >
          {Object.entries(LOCATIONS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handleFlyTo(key)}
              onMouseEnter={() => setHoveredTab(key)}
              onMouseLeave={() => setHoveredTab(null)}
              style={pillButtonStyle(activeTab === key, hoveredTab === key, '9.5px', '26px', '9px')}
            >
              {data.name}
            </button>
          ))}
        </div>
      </div>

      {/* TOP LEFT — close map, return to the static image view */}
      <button
        onClick={onClose}
        onMouseEnter={() => setIsBackHovered(true)}
        onMouseLeave={() => setIsBackHovered(false)}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          zIndex: 10,
          ...standaloneGlassButtonStyle(false, isBackHovered),
        }}
      >
        Back
      </button>

      {/* TOP RIGHT — reset camera to L&T HQ */}
      <button
        onClick={() => handleFlyTo('hq')}
        onMouseEnter={() => setIsResetHovered(true)}
        onMouseLeave={() => setIsResetHovered(false)}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          zIndex: 10,
          ...standaloneGlassButtonStyle(activeTab === 'hq', isResetHovered),
        }}
      >
        Reset
      </button>
    </div>
  )
}

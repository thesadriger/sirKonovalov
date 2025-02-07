import{M as G,S as _,U as A,R as L,r as t,e as T,P as V,V as p,u as v,_ as h,B as O,C as w,a as j,j as o,b as y,O as S,A as U,m as N,c as B,d as H,f as W,g as q}from"./index-5e684943.js";import{E as Z,S as $}from"./SMAA-1880f31f.js";function J(l,n,r,s){const a=class extends _{constructor(f={}){const c=Object.entries(l);super({uniforms:c.reduce((u,[i,m])=>{const g=A.clone({[i]:{value:m}});return{...u,...g}},{}),vertexShader:n,fragmentShader:r}),this.key="",c.forEach(([u])=>Object.defineProperty(this,u,{get:()=>this.uniforms[u].value,set:i=>this.uniforms[u].value=i})),Object.assign(this,f),s&&s(this)}};return a.key=G.generateUUID(),a}const K=()=>parseInt(L.replace(/\D+/g,"")),Q=K(),X=J({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new w,sectionColor:new w,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new p,worldPlanePosition:new p},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${Q>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),Y=t.forwardRef(({args:l,cellColor:n="#000000",sectionColor:r="#2080ff",cellSize:s=.5,sectionSize:a=1,followCamera:e=!1,infiniteGrid:f=!1,fadeDistance:c=100,fadeStrength:u=1,fadeFrom:i=1,cellThickness:m=.5,sectionThickness:g=1,side:M=O,...C},b)=>{T({GridMaterial:X});const d=t.useRef(null);t.useImperativeHandle(b,()=>d.current,[]);const x=new V,R=new p(0,1,0),E=new p(0,0,0);v(D=>{x.setFromNormalAndCoplanarPoint(R,E).applyMatrix4(d.current.matrixWorld);const P=d.current.material,k=P.uniforms.worldCamProjPosition,I=P.uniforms.worldPlanePosition;x.projectPoint(D.camera.position,k.value),I.value.set(0,0,0).applyMatrix4(d.current.matrixWorld)});const z={cellSize:s,sectionSize:a,cellColor:n,sectionColor:r,cellThickness:m,sectionThickness:g},F={fadeDistance:c,fadeStrength:u,fadeFrom:i,infiniteGrid:f,followCamera:e};return t.createElement("mesh",h({ref:d,frustumCulled:!1},C),t.createElement("gridMaterial",h({transparent:!0,"extensions-derivatives":!0,side:M},z,F)),t.createElement("planeGeometry",{args:l}))});function ee(l,n){const r=l+"Geometry";return t.forwardRef(({args:s,children:a,...e},f)=>{const c=t.useRef(null);return t.useImperativeHandle(f,()=>c.current),t.useLayoutEffect(()=>void(n==null?void 0:n(c.current))),t.createElement("mesh",h({ref:c},e),t.createElement(r,{attach:"geometry",args:s}),a)})}const te=ee("box"),oe=()=>o.jsx("meshStandardMaterial",{attach:"material",color:"#cccccc",roughness:.8,metalness:.2}),re=({url:l,onCreated:n})=>{const{scene:r,materials:s}=H(l,{useCache:!0,draco:!0}),a=t.useMemo(()=>(r.traverse(e=>{e.isMesh&&(e.geometry.computeVertexNormals(),e.geometry.computeBoundingSphere(),e.material=new W({color:e.material.color,map:e.material.map,normalMap:e.material.normalMap,roughness:.5,metalness:.2,transparent:e.material.transparent,opacity:e.material.opacity}),e.castShadow=!0,e.receiveShadow=!0,e.material.needsUpdate=!0)}),r),[r]);return t.useEffect(()=>{n==null||n()},[n]),o.jsx("primitive",{object:a,dispose:null,scale:.01})},ae=()=>{const[l,n]=t.useState(60),r=t.useRef(performance.now()),s=t.useRef(0);return t.useEffect(()=>{const a=()=>{const e=performance.now();s.current++,e-r.current>=1e3&&(n(s.current),s.current=0,r.current=e),requestAnimationFrame(a)};a()},[]),l},ne=()=>{const[l,n]=t.useState(()=>Math.min(window.devicePixelRatio,2)),r=ae(),{gl:s}=q();return v(()=>{if(r<45){const a=Math.max(.75,l-.25);s.setPixelRatio(a),n(a)}else if(r>55){const a=Math.min(2,l+.25);s.setPixelRatio(a),n(a)}}),null};j.memo(({modelPath:l,onCreated:n,onRotateStart:r,onRotateEnd:s})=>{const[a,e]=t.useState(!1);return o.jsxs(y,{shadows:!0,gl:{antialias:!0,powerPreference:"high-performance",alpha:!0},camera:{position:[0,0,2.5],fov:45,near:.1,far:1e3},children:[o.jsx(ne,{}),o.jsx("ambientLight",{intensity:.5}),o.jsx("directionalLight",{position:[5,5,5],intensity:1,castShadow:!0,"shadow-mapSize-width":2048,"shadow-mapSize-height":2048}),o.jsx(t.Suspense,{fallback:o.jsx(oe,{}),children:o.jsx(re,{url:l,onCreated:n})}),o.jsx(Z,{multisampling:0,children:o.jsx($,{})}),o.jsx(S,{enableDamping:!0,dampingFactor:.05,autoRotate:!a,minDistance:1,maxDistance:5,onStart:()=>{e(!0),r==null||r()},onEnd:()=>{e(!1),s==null||s()}})]})});const ce=({onRotateStart:l,onRotateEnd:n,autoRotate:r})=>{const[s,a]=t.useState(!0),[e,f]=j.useState(null),c=t.useRef(),u=t.useRef(null);return t.useEffect(()=>{const i=c.current;if(!i)return;const m=()=>{i.autoRotate=!0,i.autoRotateSpeed=.5,setTimeout(()=>{i.autoRotateSpeed=1},1e3)};return i.addEventListener("end",m),()=>i.removeEventListener("end",m)},[]),t.useEffect(()=>{const i=c.current;i&&(r?(i.autoRotate=!0,i.autoRotateSpeed=.5):i.autoRotate=!1)},[r]),e?o.jsxs("div",{className:"error-fallback",children:["Ошибка загрузки: ",e]}):o.jsxs("div",{className:"cube-container",ref:u,style:{width:"100%",height:"100%",position:"relative",overflow:"hidden"},children:[o.jsx(U,{children:s&&o.jsx(N.div,{initial:{opacity:1},exit:{opacity:0},className:"preloader-overlay",children:o.jsx(B,{})})}),o.jsxs(y,{onCreated:()=>a(!1),camera:{position:[4,4,4],fov:45,near:.1,far:1e3},frameloop:"always",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",touchAction:"none"},children:[o.jsx("ambientLight",{intensity:.5}),o.jsx("pointLight",{position:[10,10,10],intensity:1}),o.jsx(Y,{position:[0,-1,0],args:[10,10],cellColor:"#6f6f6f",sectionColor:"#4a4a4a",fadeDistance:30,fadeStrength:1}),o.jsx(te,{args:[2,2,2],children:o.jsx("meshStandardMaterial",{color:"#ffffff",roughness:.5,metalness:.3,emissive:"#000000",emissiveIntensity:.1})}),o.jsx(S,{ref:c,enableZoom:!0,enablePan:!0,touchAction:"pan-y",maxDistance:8,minDistance:4,minPolarAngle:Math.PI/3,maxPolarAngle:Math.PI/2,autoRotate:!0,autoRotateSpeed:2,onStart:()=>{l(),document.body.style.cursor="grabbing",c.current.autoRotate=!1},onEnd:()=>{n(),document.body.style.cursor="default",c.current.autoRotate=!0}})]})]})};export{ce as default};

"use client";

import "@google/model-viewer/lib/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ModelViewerJSX {
  src: string;
  poster?: string;
  iosSrc?: string;
  seamlessPoster?: boolean;
  autoplay?: boolean;
  environmentImage?: string;
  exposure?: string;
  interactionPromptThreshold?: string;
  shadowIntensity?: string;
  ar?: boolean;
  arModes?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  cameraOrbit?: string;
  alt?: string;
  sx?: any;
}

const Model = () => {
  const glbSrc = "wall.glb";
  return (
    <div className=" grow flex justify-center items-center">
      <model-viewer
        src="wall.glb"
        style={{ width: "100%", height: "100%" }}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        poster="poster.webp"
        shadow-intensity="1.18"
        tone-mapping="neutral"
        camera-orbit="51.83deg 74.48deg 83.71m"
        field-of-view="30deg"
        min-camera-orbit="auto auto 83.71m"
        min-field-of-view="30deg"
        shadow-softness="1"
        exposure="1.18"
      >
        <button
          className="Hotspot"
          slot="hotspot-9"
          data-position="1.6735132082731496m 1.6572481379063877m 13.804788317874303m"
          data-normal="0.6684161655684746m -2.870547579765001e-9m 0.7437874895470733m"
          data-visibility-attribute="visible"
        >
          <div className="text-black font-bold border rounded-md bg-white p-2">
            Positif
          </div>
        </button>
        <button
          className="Hotspot"
          slot="hotspot-10"
          data-position="2.9910232493778466m 1.4419063418174328m -6.610704816625063m"
          data-normal="0.9941958107100552m -0.04751091344220205m 0.09652669615429643m"
          data-visibility-attribute="visible"
        >
          <div className="text-black font-bold border rounded-md bg-white p-2">
            Dévers
          </div>
        </button>
        <button
          className="Hotspot"
          slot="hotspot-11"
          data-position="0.9999999999999858m 1.29800992486690525m 2.864438755173822m"
          data-normal="1m 0m 0m"
          data-visibility-attribute="visible"
        >
          <div className="text-black font-bold border rounded-md bg-white p-2">
            Dalle
          </div>
        </button>
        <button
          className="Hotspot"
          slot="hotspot-12"
          data-position="1.9578499665681761m 11.728949333704737m -15.298281543550868m"
          data-normal="0.9993895649433258m -0.034934113694362785m 0.0003243189469884793m"
          data-visibility-attribute="visible"
        >
          <div className="text-black font-bold border rounded-md bg-white p-2">
            7m de haut
          </div>
        </button>
        <button
          className="Hotspot"
          slot="hotspot-13"
          data-position="0.999611857325263m 10.783475776181284m 4.015679775431625m"
          data-normal="0.9999999820717078m -1.7625301964589778e-11m 0.00018935834817227244m"
          data-visibility-attribute="visible"
        >
          <div className="text-black font-bold border rounded-md bg-white p-2">
            13 Couloirs
          </div>
        </button>
      </model-viewer>
    </div>
  );
};

export default Model;

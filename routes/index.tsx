import { Head } from "$fresh/runtime.ts";
import MapComponent from "../islands/MapComponent.tsx";
// import "https://esm.sh/raf@3.4.1/polyfill";

export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
        <title>Sheets Mapper</title>
      </Head>
      <div class="p-4 mx-auto h-screen">
        <MapComponent />
      </div>
    </>
  );
}

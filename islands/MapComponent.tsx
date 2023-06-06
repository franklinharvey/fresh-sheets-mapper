import { useRef, useEffect, useCallback, useState } from "preact/hooks";
declare const L: any;

type Location = {
  name: string;
  address: string;
  note: string;
  lat: string;
  lng: string;
  color: string;
};

const markerHtmlStyles = (color: string) => `
  background-color: ${color};
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  box-shadow: -1px -1px 8px 0px #fff;
`;

export default function MapComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [sheet, setSheet] = useState<Location[]>([]);

  const getSheet = useCallback(async () => {
    const resp = await fetch(`/api/sheet`);
    return resp.json();
  }, []);

  useEffect(() => {
    getSheet().then((sheet) => {
      setSheet(sheet);
    });
  }, []);

  useEffect(() => {
    const points: [string, string][] = [];
    if (mapRef.current) {
      sheet.forEach((row) => {
        const icon = L.divIcon({
          className: "my-custom-pin",
          iconAnchor: [0, 24],
          labelAnchor: [-6, 0],
          popupAnchor: [0, -36],
          html: `<span style="${markerHtmlStyles(row.color) ?? `grey`}" />`,
        });
        L.marker([row.lat, row.lng], { icon })
          .bindTooltip(row.name)
          .bindPopup(
            ` <p>
              <b>${row.name}</b>
              <br />
              ${row.note}
            </p>`
          )
          .addTo(mapRef.current);
        points.push([row.lat, row.lng]);
      });
      mapRef.current.fitBounds(points);
    }
  }, [sheet, mapRef]);

  useEffect(() => {
    if (containerRef.current) {
      if (!mapRef.current) {
        mapRef.current = new L.Map(containerRef.current).setView([0, 0], 13);
      }
      L.tileLayer('https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key={apikey}', {
        attribution: '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '<your apikey>',
        maxZoom: 19
      }).addTo(mapRef.current);
    }
  }, []);

  return <div ref={containerRef} className={"h-full w-full"}></div>;
}

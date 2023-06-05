import { useRef, useEffect, useCallback, useState } from "preact/hooks";
declare const L: any;

type Location = {
  name: string;
  address: string;
  note: string;
  lat: string;
  lng: string;
};

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
        L.marker([row.lat, row.lng])
          .bindTooltip(row.name)
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
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  return <div ref={containerRef} className={"h-full w-full"}></div>;
}

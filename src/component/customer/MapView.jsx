// src/components/MapView.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ onSelectBranch }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // ป้องกันการ render แผนที่ซ้ำ
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([13.913, 100.498], 14);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const kfcIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // สร้างปุ่มบน Popup แบบ DOM Element เพื่อผูก Event Listener ของ React ได้
    const createPopupContent = (branchName) => {
      const div = document.createElement("div");
      div.className = "text-center font-sans";
      div.innerHTML = `<b class="text-brand-black text-sm">KFC สาขา ${branchName}</b><br>`;

      const btn = document.createElement("button");
      btn.className =
        "mt-2 bg-brand-red text-white px-3 py-1 rounded text-xs hover:bg-red-800";
      btn.innerText = "เลือกสาขานี้";
      btn.onclick = () => onSelectBranch(branchName); // เรียก Props

      div.appendChild(btn);
      return div;
    };

    L.marker([13.9008, 100.4983], { icon: kfcIcon })
      .addTo(map)
      .bindPopup(createPopupContent("โลตัส ปากเกร็ด"));

    L.marker([13.9085, 100.499], { icon: kfcIcon })
      .addTo(map)
      .bindPopup(createPopupContent("เมเจอร์ ฮอลลีวูด ปากเกร็ด"));

    // Cleanup เมื่อ Component ถูกทำลาย
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [onSelectBranch]);

  return (
    <div
      ref={mapRef}
      className="w-full h-100 border-4 border-brand-black rounded shadow-lg z-10"
    />
  );
}

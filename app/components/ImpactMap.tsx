'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Activity, Truck, Circle as CircleIcon } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface FirePoint {
    lat: number;
    lng: number;
    intensity: number;
    area: string;
}

const REAL_LIFE_CLUSTERS: FirePoint[] = [
    { lat: 30.21, lng: 74.48, intensity: 72, area: "Bathinda Rural" },
    { lat: 30.56, lng: 75.84, intensity: 45, area: "Ludhiana Perimeter" },
    { lat: 29.98, lng: 76.81, intensity: 88, area: "Kurukshetra District" },
    { lat: 31.12, lng: 75.31, intensity: 65, area: "Moga East" },
    { lat: 30.34, lng: 76.38, intensity: 52, area: "Patiala Plains" }
];

export default function VillageImpactMap({ profileData, forcedLocation }: { profileData?: any; forcedLocation?: [number, number] | null }) {
    const { t } = useLanguage();
    const [isClient, setIsClient] = useState(false);
    const [L, setL] = useState<any>(null);
    const [userLoc, setUserLoc] = useState<[number, number]>(forcedLocation || [31.1471, 75.3412]);
    const [fires, setFires] = useState<FirePoint[]>(REAL_LIFE_CLUSTERS);
    const [truckLoc, setTruckLoc] = useState<[number, number]>([31.1, 75.3]);

    useEffect(() => {
        setIsClient(true);

        // Only auto-fetch if no forced location is provided
        if (!forcedLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setUserLoc([lat, lng]);
                    setTruckLoc([lat + 0.04, lng + 0.04]);
                    const localFires = Array.from({ length: 3 }).map((_, i) => ({
                        lat: lat + (Math.random() - 0.5) * 0.1,
                        lng: lng + (Math.random() - 0.5) * 0.1,
                        intensity: Math.floor(Math.random() * 30) + 30,
                        area: `Hotspot ${i + 1}`
                    }));
                    setFires([...REAL_LIFE_CLUSTERS, ...localFires]);
                },
                (err) => setUserLoc([31.1471, 75.3412]),
                { timeout: 5000 }
            );
        } else if (forcedLocation) {
            setUserLoc(forcedLocation);
            setTruckLoc([forcedLocation[0] + 0.04, forcedLocation[1] + 0.04]);
        }

        const interval = setInterval(() => {
            setTruckLoc(prev => [prev[0] - 0.0001, prev[1] - 0.0001]);
        }, 1000);

        import('leaflet').then((leaflet) => {
            setL(leaflet);
            if (leaflet.Icon.Default) {
                delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
                leaflet.Icon.Default.mergeOptions({
                    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
                    iconUrl: '/leaflet/marker-icon.png',
                    shadowUrl: '/leaflet/marker-shadow.png',
                });
            }
        });

        return () => clearInterval(interval);
    }, [forcedLocation]);

    if (!isClient) return <div className="h-full w-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold uppercase tracking-widest text-xs animate-pulse rounded-3xl">Pinging Satellite...</div>;

    return (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-emerald-100 flex flex-col h-full relative group shadow-2xl">
            <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-100 shadow-xl pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="text-emerald-500 animate-pulse" size={16} />
                        <h3 className="text-xs font-black text-emerald-900 uppercase tracking-widest leading-none">VILLAGE WATCH ENGINE</h3>
                    </div>
                    <p className="text-[10px] text-earth-500 font-bold">Scanning Thermal Infared Hotspots...</p>
                </div>

                <div className="bg-amber-600/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-amber-400 shadow-xl pointer-events-none flex items-center gap-3">
                    <Truck className="text-white animate-bounce" size={16} />
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">ORDER #{profileData?.orders?.[0]?.id || '4402'}</h3>
                        <p className="text-[9px] text-amber-100 font-bold mt-1 uppercase">Truck En-Route · ETA 12m</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow relative h-full">
                {L && (
                    <MapContainer
                        center={userLoc}
                        zoom={10}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                        key={userLoc.join(',')}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={userLoc} icon={L.divIcon({
                            className: 'custom-user-marker',
                            html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(16,185,129,0.8); display: flex; align-items: center; justify-content: center; color: white;">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                                   </div>`,
                            iconSize: [28, 28],
                        })}>
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-black text-emerald-900 text-xs uppercase">YOUR FARMLAND</h4>
                                    <p className="text-[10px] text-earth-500 mt-1 font-bold">Satellite Lock: ENABLED</p>
                                </div>
                            </Popup>
                        </Marker>

                        <Marker position={truckLoc} icon={L.divIcon({
                            className: 'truck-marker',
                            html: `<div style="background-color: #f59e0b; width: 34px; height: 34px; border-radius: 12px; border: 3px solid white; box-shadow: 0 0 15px rgba(245,158,11,0.6); display: flex; align-items: center; justify-content: center; color: white;">
                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                   </div>`,
                            iconSize: [34, 34],
                        })}>
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-black text-amber-600 text-xs uppercase">COLLECTION TRUCK</h4>
                                    <p className="text-[10px] text-earth-500 mt-1 font-bold">Status: EN-ROUTE TO FARM</p>
                                    <div className="mt-2 bg-amber-50 text-amber-700 text-[9px] font-black p-1.5 rounded-lg border border-amber-100 text-center">ETA: 12 MINS</div>
                                </div>
                            </Popup>
                        </Marker>

                        {fires.map((fire, idx) => (
                            <React.Fragment key={`fire-group-${idx}`}>
                                <Circle
                                    center={[fire.lat, fire.lng]}
                                    radius={1500}
                                    pathOptions={{
                                        fillColor: '#ef4444',
                                        color: '#b91c1c',
                                        weight: 2,
                                        fillOpacity: 0.25
                                    }}
                                />
                                <Marker position={[fire.lat, fire.lng]} icon={L.divIcon({
                                    className: 'fire-icon',
                                    html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #ef4444;"></div>`,
                                    iconSize: [12, 12]
                                })}>
                                    <Popup>
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                                                <h4 className="font-black text-red-600 text-xs uppercase">ACTIVE HOTSPOT</h4>
                                            </div>
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-[10px] font-black text-earth-900 uppercase">
                                                    <span>INTENSITY:</span>
                                                    <span className={`${fire.intensity > 70 ? 'text-red-600' : 'text-amber-600'}`}>{fire.intensity}%</span>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-black text-earth-900 uppercase">
                                                    <span>AREA:</span>
                                                    <span>{fire.area}</span>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black p-2 rounded-lg border border-emerald-100 text-center uppercase">
                                                Demand Spike: +₹500/T
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            </React.Fragment>
                        ))}
                    </MapContainer>
                )}

                <div className="absolute bottom-6 right-6 z-[1000] bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xl min-w-[170px]">
                    <h5 className="text-[10px] font-black text-earth-400 uppercase tracking-widest mb-3 border-b border-earth-50 pb-2">MAP LEGEND</h5>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>
                            <span className="text-[11px] font-bold text-earth-800">Your Base</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
                            <span className="text-[11px] font-bold text-earth-800">Burning Hotspot</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-[4px] bg-amber-500 border-2 border-white shadow-md"></div>
                            <span className="text-[11px] font-bold text-earth-800">Collection Truck</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-white shadow-sm"></div>
                            <span className="text-[11px] font-bold text-earth-400">Processing Hub</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

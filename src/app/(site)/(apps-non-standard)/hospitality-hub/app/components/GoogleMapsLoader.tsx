'use client';

import { useLoadScript } from '@react-google-maps/api';
import React from 'react';

const GOOGLE_MAPS_LIBRARIES: Array<'places' | 'drawing' | 'geometry' | 'visualization'> = ['places'];

export default function GoogleMapsLoader({ children }:{children:React.ReactNode}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly',
  });
  if (loadError) return <p>Maps failed to load</p>;
  if (!isLoaded)   return null;
  return <>{children}</>;
}
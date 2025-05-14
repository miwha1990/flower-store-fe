import { useState, useEffect, useRef } from 'react';

import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { TextField } from '@mui/material';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  label?: string;
}

const PlaceAutocomplete = ({
  onPlaceSelect,
  label,
}: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <TextField slotProps={{ htmlInput: { ref: inputRef } }} label={label} />
  );
};

export const GoogleSearchInput = ({
  onPlaceSelect,
  label,
}: PlaceAutocompleteProps) => {
  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <PlaceAutocomplete label={label} onPlaceSelect={onPlaceSelect} />
    </APIProvider>
  );
};

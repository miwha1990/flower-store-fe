import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  label?: string;
  defaultValue?: string;
  name: string;
}

const PlaceAutocomplete = ({
  onPlaceSelect,
  label,
  defaultValue,
  name
}: PlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? '');
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.PlacePrediction[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    setInputValue(defaultValue ?? '');
  }, [defaultValue]);

  useEffect(() => {
    const term = inputValue.trim();
    if (!places || !searchEnabled || term.length < 3) {
      setPredictions([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const timeout = window.setTimeout(async () => {
      try {
        const response =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: term,
            includedRegionCodes: ['ua'],
            language: 'uk',
            region: 'ua',
          });

        if (active) {
          setPredictions(
            response.suggestions.flatMap((suggestion) =>
              suggestion.placePrediction ? [suggestion.placePrediction] : []
            )
          );
        }
      } catch (suggestionError) {
        if (active) {
          setPredictions([]);
          setError(
            suggestionError instanceof Error
              ? suggestionError.message
              : 'Не вдалося завантажити адреси.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [inputValue, places, searchEnabled]);

  const handlePlaceSelect = async (
    prediction: google.maps.places.PlacePrediction | null
  ) => {
    if (!prediction) {
      onPlaceSelect(null);
      return;
    }

    try {
      const place = prediction.toPlace();
      await place.fetchFields({
        fields: ['formattedAddress', 'location', 'displayName'],
      });
      onPlaceSelect(place);
      setInputValue(place.formattedAddress ?? prediction.text.text);
      setPredictions([]);
    } catch (placeError) {
      setError(
        placeError instanceof Error
          ? placeError.message
          : 'Не вдалося завантажити дані адреси.'
      );
    }
  };

  return (
    <Autocomplete
      options={predictions}
      inputValue={inputValue}
      loading={loading}
      filterOptions={(options) => options}
      getOptionLabel={(prediction) => prediction.text.text}
      isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
      noOptionsText={
        inputValue.trim().length < 3
          ? 'Введіть щонайменше 3 символи'
          : 'Адресу не знайдено'
      }
      onInputChange={(_event, value, reason) => {
        setInputValue(value);
        if (reason === 'input') {
          setSearchEnabled(true);
          setPredictions([]);
          onPlaceSelect(null);
        } else {
          setSearchEnabled(false);
        }
      }}
      onChange={(_event, prediction) => void handlePlaceSelect(prediction)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={Boolean(error)}
          helperText={error}
          name={name}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export const GoogleSearchInput = ({
  onPlaceSelect,
  label,
  defaultValue,
  name
}: PlaceAutocompleteProps) => {
  return (
    <APIProvider apiKey={API_KEY}>
      <PlaceAutocomplete
        name={name}
        label={label}
        onPlaceSelect={onPlaceSelect}
        defaultValue={defaultValue}
      />
    </APIProvider>
  );
};

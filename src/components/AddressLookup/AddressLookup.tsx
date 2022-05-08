import { useCallback, useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useNavigate } from 'react-router-dom';
import type { StrictDropdownProps } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';

import useGoogleMaps from 'src/hooks/use-google-maps';

const SEARCH_OPTIONS = {
  componentRestrictions: { country: 'lv' },
  types: ['address'],
};

export default function AddressLookup() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const { isLoaded, loadError } = useGoogleMaps();

  const handleSelect = useCallback<
    NonNullable<StrictDropdownProps['onChange']>
  >(
    (event, { value: selectedAddress }) => {
      setAddress(String(selectedAddress));

      if (!selectedAddress) {
        return;
      }

      geocodeByAddress(String(selectedAddress))
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          const lat = String(latLng.lat).substr(0, 7);
          const lng = String(latLng.lng).substr(0, 7);
          const zoom = 16;

          const path = `/${lat},${lng},${zoom}/locate-building`;

          navigate(path);
        })
        .catch((error) => console.error('Error', error));
    },
    [navigate],
  );

  if (!isLoaded || loadError) return null;

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      searchOptions={SEARCH_OPTIONS}
    >
      {({ suggestions, loading, getInputProps }) => (
        <Dropdown
          fluid
          selection
          clearable
          search={(options) => options}
          options={suggestions.map((item) => ({
            text: item.description,
            value: item.description,
          }))}
          value={address}
          placeholder="Search by address"
          noResultsMessage={null}
          loading={loading}
          onChange={handleSelect}
          onFocus={(event: any) => getInputProps().onKeyDown(event)}
          onSearchChange={(event: any) => getInputProps().onChange(event)}
        />
      )}
    </PlacesAutocomplete>
  );
}

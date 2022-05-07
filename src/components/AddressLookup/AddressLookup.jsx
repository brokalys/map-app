import { useCallback, useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import useGoogleMaps from 'src/hooks/use-google-maps';

const SEARCH_OPTIONS = {
  componentRestrictions: { country: 'lv' },
  types: ['address'],
};

export default function AddressLookup() {
  const history = useHistory();
  const [address, setAddress] = useState('');

  const { isLoaded, loadError } = useGoogleMaps();

  const handleSelect = useCallback(
    (event, { value: selectedAddress }) => {
      setAddress(selectedAddress);

      if (!selectedAddress) {
        return;
      }

      geocodeByAddress(selectedAddress)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          const lat = String(latLng.lat).substr(0, 7);
          const lng = String(latLng.lng).substr(0, 7);
          const zoom = 16;

          const path = `/${lat},${lng},${zoom}/locate-building`;

          history.push(path);
        })
        .catch((error) => console.error('Error', error));
    },
    [history],
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
          onFocus={getInputProps().onKeyDown}
          onSearchChange={getInputProps().onChange}
        />
      )}
    </PlacesAutocomplete>
  );
}

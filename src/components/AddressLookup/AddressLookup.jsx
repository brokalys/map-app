import { useCallback, useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import useGoogleMaps from 'src/hooks/use-google-maps';
import * as actions from 'src/store/actions';

const SEARCH_OPTIONS = {
  componentRestrictions: { country: 'lv' },
  types: ['address'],
};

export default function AddressLookup() {
  const dispatch = useDispatch();
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
          dispatch(actions.clickOnSuggestedAddress(latLng));
        })
        .catch((error) => console.error('Error', error));
    },
    [dispatch],
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

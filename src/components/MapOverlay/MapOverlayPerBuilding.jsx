import React, { useContext } from 'react';
import { Dimmer, Loader, Message, Table } from 'semantic-ui-react';
import moment from 'moment';

import BuildingContext from 'context/BuildingContext';
import useActiveBuilding from 'hooks/use-active-building';

const RENT_TYPE_SUFFIX = {
  yearly: '/y',
  monthly: '/m',
  weekly: '/w',
  daily: '/d',
};

function MapOverlayPerBuilding() {
  const [activeBuilding] = useActiveBuilding();

  if (!activeBuilding) {
    return (
      <Message info>
        <Message.Header>
          Interested to see details of a specific property?
        </Message.Header>
        <p>
          Click on one of the highlighted properties to see the historical data
          for this property.
        </p>
      </Message>
    );
  }

  return (
    <>
      <Message info>
        <p>
          Data might be inaccurate. Some people provide wrong locations for
          their classifieds.
        </p>
      </Message>
      <Table
        basic="very"
        singleLine
        selectable
        compact="very"
        textAlign="right"
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="left">Category</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Type</Table.HeaderCell>
            <Table.HeaderCell>Total price</Table.HeaderCell>
            <Table.HeaderCell>SQM Price</Table.HeaderCell>
            <Table.HeaderCell>Area</Table.HeaderCell>
            <Table.HeaderCell>Rooms</Table.HeaderCell>
            <Table.HeaderCell>Floor</Table.HeaderCell>
            <Table.HeaderCell>Published At</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {activeBuilding.properties.results.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell textAlign="left">{row.category}</Table.Cell>
              <Table.Cell textAlign="left">{row.type}</Table.Cell>
              <Table.Cell>
                {row.price.toLocaleString()} €
                {row.type === 'rent' && RENT_TYPE_SUFFIX[row.rent_type]}
              </Table.Cell>
              <Table.Cell>
                {row.price_per_sqm && (
                  <>
                    {Math.round(row.price_per_sqm).toLocaleString()} €/m
                    <sup>2</sup>
                  </>
                )}
              </Table.Cell>
              <Table.Cell>
                {row.area && (
                  <>
                    {row.area.toLocaleString()} m<sup>2</sup>
                  </>
                )}
              </Table.Cell>
              <Table.Cell>{row.rooms}</Table.Cell>
              <Table.Cell>{row.floor}</Table.Cell>
              <Table.Cell>
                {row.published_at
                  ? moment(row.published_at).format('YYYY-MM-DD HH:mm')
                  : 'Before 2018'}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

export default function MapOverlayPerBuildingContainer() {
  const context = useContext(BuildingContext);

  return (
    <>
      <Dimmer inverted active={context.loading}>
        <Loader content="Loading new buildings.." />
      </Dimmer>
      {context.error && (
        <Message negative>
          An unexpected error occured when attempting to fetch the data. Try
          again later.
        </Message>
      )}

      <MapOverlayPerBuilding />
    </>
  );
}

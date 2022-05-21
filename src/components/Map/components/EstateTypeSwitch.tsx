import { useCallback } from 'react';
import { Button, Popup } from 'semantic-ui-react';

import useEstateTypeFilter from 'src/hooks/use-estate-type-filter';

import styles from './EstateTypeSwitch.module.css';

interface EstateTypeSwitchProps {
  disabled?: boolean;
}

const EstateTypeSwitch: React.FC<EstateTypeSwitchProps> = (props) => {
  const [type, setType] = useEstateTypeFilter();

  const onButtonClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setType((ev.target as any).value);
    },
    [setType],
  );

  return (
    <div className={styles.container}>
      <Popup
        content="Zoom in to see data about specific buildings or land plots"
        position="top center"
        disabled={!props.disabled}
        trigger={
          <Button.Group size="large">
            <Button
              disabled={props.disabled}
              positive={type === 'building'}
              onClick={onButtonClick}
              value="building"
            >
              Buildings
            </Button>
            <Button.Or />
            <Button
              disabled={props.disabled}
              positive={type === 'land'}
              onClick={onButtonClick}
              value="land"
            >
              Land
            </Button>
          </Button.Group>
        }
      />
    </div>
  );
};

export default EstateTypeSwitch;

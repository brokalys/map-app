import Lottie from 'lottie-react';
import PropType from 'prop-types';
import { Container } from 'semantic-ui-react';

export default function ContentContainer(props) {
  return (
    <Container textAlign="center">
      <Lottie {...props.lottie} />
      <div style={{ position: 'relative' }}>{props.children}</div>
    </Container>
  );
}

ContentContainer.propTypes = {
  lottie: PropType.shape({
    className: PropType.string,
    animationData: PropType.object.isRequired,
    loop: PropType.bool,
  }).isRequired,
  children: PropType.node.isRequired,
};

import Lottie from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';
import type React from 'react';
import { Container } from 'semantic-ui-react';

interface ContentContainerProps {
  lottie: LottieComponentProps;
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = (props) => {
  return (
    <Container textAlign="center">
      <Lottie {...props.lottie} />
      <div style={{ position: 'relative' }}>{props.children}</div>
    </Container>
  );
};
export default ContentContainer;

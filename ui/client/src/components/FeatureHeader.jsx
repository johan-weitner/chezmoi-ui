import {
  Badge,
  Group
} from '@mantine/core';
import SubHeader from './SubHeader';

const FeatureHeader = props => {
  const { os, changeKey, save, startOver } = props;

  return (
    <>
      <Group justify="center">
        <Badge variant="filled" size="xl">
          <span style={{ textTransform: "capitalize" }}>{os}</span>
        </Badge>
      </Group>
      <SubHeader keys={[]} changeKey={changeKey} save={ save } startOver={ startOver } />
    </>
  );
};

export default FeatureHeader;
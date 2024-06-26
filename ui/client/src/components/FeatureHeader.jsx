import {
  Badge,
  Group
} from '@mantine/core';

const FeatureHeader = props => {
  const { os, changeKey } = props;

  return (
    <>
      <Group justify="center">
        <Badge variant="filled" size="xl">
          <span style={{ textTransform: "capitalize" }}>{os}</span>
        </Badge>
      </Group>
      <SubHeader keys={keys} changeKey={changeKey} />
    </>
  );
};

export default FeatureHeader;
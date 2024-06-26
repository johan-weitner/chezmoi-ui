import YAML from 'yaml';

const OutputView = props => {
  const { mergedArray } = props;
  const newMergedArray = [];
  const mergedKeys = Object.keys(mergedArray);
  mergedKeys.map(item => {
    newMergedArray.push({
      [item]: {
        ...mergedArray[item],
        keyy: item
      }
    })
  });

  return (<textarea style={{ width:'100%', height:'800px' }}>{ YAML.stringify(mergedArray, null, 2) }</textarea>);
};

export default OutputView;
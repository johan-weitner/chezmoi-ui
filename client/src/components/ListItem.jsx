import { rem } from "@mantine/core";
import { ICON } from "../constants/icons";
import classes from "./MainView.module.css";
import { useAppCollection } from "api/appCollectionApi";
import { EditedIndicator } from './Indicator';

/**
 * Renders a list item component that displays software information and provides actions to select, edit, and delete the item.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.software - An object containing software information.
 * @param {Function} props.selectApp - A function to handle selecting the app.
 * @param {Function} props.editItem - A function to handle editing the item.
 * @param {Function} props.deleteItem - A function to handle deleting the item.
 * @param {string} props.item - The identifier of the item.
 * @returns {JSX.Element} The rendered list item component.
 */
export const ListItem = props => {
  const { selectApp, selectedApp, editItem, deleteItem, item } = props;
  const { data: software } = useAppCollection();
  const className = selectedApp?.key === item ? classes.selected : null;
  const indicateEdit = software[item]?.edited ? (<EditedIndicator />) : null;

  return (
    <div style={{ position: "relative", width: "100%" }} className={className}>
      <button
        className={classes.itemBox}
        onClick={(e) => selectApp(e, item)}
        style={{ width: "100%" }}
        type="button"
      >
        {software[item]?._name}
      </button>
      <ICON.edit
        style={{
          width: rem(20),
          height: rem(20),
          position: "absolute",
          right: "45px",
          top: "14px",
          cursor: "pointer",
        }}
        stroke={2}
        color="white"
        onClick={() => editItem(item, true)}
      />
      <ICON.remove
        style={{
          width: rem(20),
          height: rem(20),
          position: "absolute",
          right: "15px",
          top: "14px",
          cursor: "pointer",
        }}
        stroke={2}
        color="white"
        onClick={() => deleteItem(item)}
      />
      {indicateEdit}
    </div>
  );
};
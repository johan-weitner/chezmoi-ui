import { rem } from "@mantine/core";
import { ICON } from "../constants/icons";
import classes from "./MainView.module.css";

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
  const { software, selectApp, editItem, deleteItem, item } = props;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        className={classes.itemBox}
        onClick={(e) => selectApp(e, item)}
        style={{ width: "100%" }}
        type="button"
      >
        {software[item]._name}
      </button>
      <ICON.edit
        style={{
          width: rem(20),
          height: rem(20),
          position: "absolute",
          right: "50px",
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
          right: "20px",
          top: "14px",
          cursor: "pointer",
        }}
        stroke={2}
        color="white"
        onClick={() => deleteItem(item)}
      />
    </div>
  );
};
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
  const { software, selectApp, selectedApp, editItem, deleteItem, item, edited } = props;
  const className = selectedApp?.key === item ? classes.selected : null;
  const indicateEdit = software[item].edited ? (<ICON.check
    style={{
      width: rem(14),
      height: rem(14),
      position: "absolute",
      right: "75px",
      top: "18px",
    }}
    stroke={2}
    color="green"
    title="Has been edited"
  />) : null;

  return (
    <div style={{ position: "relative", width: "100%" }} className={className}>
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
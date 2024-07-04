[View code on GitHub](https://github.com/johan-weitner/chezmoi-ui.git/.autodoc/docs/json/client/src/utils)

The `.autodoc/docs/json/client/src/utils` folder in the chezmoi-ui project contains utility functions that enhance the functionality and user experience of the project.

The `hotkeys.js` file contains the `initHotKeys` function, which initializes hotkeys for UI components. This function uses the `useHotkeys` hook from the `react-hotkeys-hook` library to define key combinations and corresponding actions. For example, pressing "esc" closes a popover or modal, while "alt + b" and "alt + n" navigate to the previous and next items or pages, respectively. This function can be integrated into any component that requires keyboard shortcuts for navigation or interaction.

```jsx
import React, { useState } from "react";

const MyComponent = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const gotoPrev = () => {
    // logic to navigate to previous item
  };

  const gotoNext = () => {
    // logic to navigate to next item
  };

  initHotKeys(setIsPopoverOpen, gotoPrev, gotoNext);

  return <div>My Component</div>;
};

export default MyComponent;
```

The `installDoctorFilter.js` file contains the `filterUnwantedNodes` function, which filters out unwanted software packages from a provided object. This function can be used to ensure that only desired software packages are processed or displayed.

```javascript
const softwarePackages = {
  "package1": { /* package details */ },
  "package2": { /* package details */ },
  "_envchain:deps": { /* package details */ },
  "_kde": { /* package details */ },
};

const filteredPackages = filterUnwantedNodes(softwarePackages);
console.log(filteredPackages);
// Output: ["package1", "package2"]
```

The `mergeLists.js` file contains the `mergeLists` function, which merges two arrays based on certain conditions. This function is likely used to combine a list of all available applications with a list of software packages, creating a new list that includes only the relevant software packages along with some default properties for missing packages.

```javascript
const allApps = ["App1", "App2", "App3"];
const softwarePackages = {
  "App1": { name: "Application 1" },
  "App3": { name: "Application 3" }
};

const mergedList = mergeLists(allApps, softwarePackages);
console.log(mergedList);
// Output: [{ "App1": { name: "Application 1" } }, { "App2": { _name: "App2", _bin: "App2", ... } }, { "App3": { name: "Application 3" } }]
```

These utility functions promote modularity and reusability in the project, and can be easily incorporated into different parts of the project as needed.

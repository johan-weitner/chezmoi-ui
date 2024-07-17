const { VITE_DEBUG, VITE_BACKEND_URL } = import.meta.env;


const titleCard = [
  "%c+------------------------------------------------+",
  "%c|                  CHEZMOI UI                    |",
  "%c|             © 2024 Johan Weitner               |",
  "%c+------------------------------------------------+"
];

const tagLine = "%c...Mounting Chezmoi UI client.....................";

const propsList = [
  `%c- Debug mode: ${VITE_DEBUG || false}`,
  `%c- Proxy /api points to ${VITE_BACKEND_URL}\n\n\n\n`
];

export const printTitleCard = () => {
  console.clear();
  titleCard.map((row) => console.log(row, "color:yellow"));
  console.log(tagLine, "color:orange");
  propsList.map((row) => console.log(row, "color:lightgreen"));
};
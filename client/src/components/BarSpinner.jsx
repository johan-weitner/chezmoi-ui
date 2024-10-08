import BarLoader from "react-spinners/BarLoader";

const BarSpinner = () => {
	return (
		<BarLoader
			loading={true}
			size={50}
			color="#3391ff"
			style={{ top: "160px", left: "0", zIndex: "999999" }}
		/>
	);
};

export default BarSpinner;

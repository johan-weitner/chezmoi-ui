const NeuButton = (props) => {
	const { children } = props;
	return (
		<div className="neubtncontainer">
			<button type="button" className="neubtn">
				{children}
			</button>
		</div>
	);
};

export default NeuButton;

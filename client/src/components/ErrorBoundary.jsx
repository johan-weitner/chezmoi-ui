/**
 * An error boundary component that catches and handles errors in its child components.
 *
 * This component provides a fallback UI to display when an error occurs in a child component.
 * It also logs the error and component stack information to the console.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.fallback] - The fallback UI to display when an error occurs.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the error boundary.
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// Example "componentStack":
		//   in ComponentThatThrows (created by App)
		//   in ErrorBoundary (created by App)
		//   in div (created by App)
		//   in App
		console.error(error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.fallback || "ERROR";
		}

		return this.props.children;
	}
}

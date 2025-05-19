const PageWrapper = ({ children }: any) => {
	return (
		<main className="mx-auto max-w-lg min-h-dvh sm:max-w-4xl font-sans w-full px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-x border-gray-700/30 backdrop-blur-sm shadow-lg">
			{children}
		</main>
	);
};

export default PageWrapper;

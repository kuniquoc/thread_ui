const PageWrapper = ({ children }: any) => {
	return (
		<main className="mx-auto max-w-lg min-h-dvh sm:max-w-4xl font-sans w-full px-4 bg-gray-950 border-gray-600 rounded-3xl shadow-md mb-8">
			{children}
		</main>
	);
};

export default PageWrapper;

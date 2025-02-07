import "./globals.css";

export const metadata = {
	title: "ADMU Cat Maps",
	description: "A map of cats in ADMU",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}

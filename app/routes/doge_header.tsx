import { Link } from "@remix-run/react";


export default function DogeHeader({ pageTitle }: string) {

	return (
		<header className="flex items-center justify-between bg-orange-950 p-4 text-white">
			<h1 className="text-3xl font-bold">
				<Link to="/">DogeCoin</Link>
			</h1>
			<h1 className="text-3xl font-bold">{pageTitle}</h1>
			<h1 className="text-3xl font-bold text-orange-950">|</h1>
		</header>
	);
};

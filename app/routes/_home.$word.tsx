import { json, type LoaderArgs } from "@remix-run/cloudflare";
import {
	isRouteErrorResponse,
	useLoaderData,
	useParams,
	useRouteError,
} from "@remix-run/react";
import { ResultView } from "~/components/ResultView";
import { getWordDefinitionsFromAPI } from "~/lib/api";
import { APIWordDefinitionsSchema } from "~/lib/schema";
import { cleanWordDefinitions } from "~/lib/utils";

export const loader = async ({ params }: LoaderArgs) => {
	const word = params.word;
	if (!word) {
		throw new Response("Invalid path", { status: 400 });
	}

	const data = await getWordDefinitionsFromAPI(word);
	if (!data) {
		throw new Response("No definitions found", { status: 404 });
	}

	const apiWordDefinitions = APIWordDefinitionsSchema.safeParse(data);
	if (!apiWordDefinitions.success) {
		throw new Response("Error parsing data", { status: 500 });
	}

	const wordDefinition = cleanWordDefinitions(apiWordDefinitions.data);

	// TODO: DELETE: simulate slow request
	await new Promise((r) => setTimeout(r, 500));

	// TODO: Caching
	return json({ ...wordDefinition });
};

export default function HomeWordPage() {
	const data = useLoaderData<typeof loader>();

	console.log(data);

	return <ResultView definitions={data} />;
}

// TODO: Styling
export function ErrorBoundary() {
	const params = useParams();
	const error = useRouteError();

	if (isRouteErrorResponse(error) && error.status === 404) {
		return <div>No definition found for the word: "{params.word}"?</div>;
	}

	return (
		<div>
			There was an error loading definition for the word: "{params.word}".
			Sorry.
		</div>
	);
}

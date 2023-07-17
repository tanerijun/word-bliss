import { useState } from "react";
import { type WordDefinitions } from "~/lib/schema";
import { capitalize } from "~/lib/utils";

const Header = ({ definitions }: { definitions: WordDefinitions }) => {
	const phonetics = definitions.phonetics
		? definitions.phonetics
				.map((phonetic) => ({
					text: phonetic.text ? phonetic.text : undefined,
					audioUrl: phonetic.audio ? phonetic.audio : undefined,
				}))
				.filter((phonetic) => phonetic.text)
		: definitions.phonetic
		? [{ text: definitions.phonetic, audioUrl: undefined }]
		: [];

	const [phoneticIndex, setPhoneticIndex] = useState(0);

	const handleClick = () => {
		const nextPhoneticIndex =
			phoneticIndex === phonetics.length - 1 ? 0 : phoneticIndex + 1;
		setPhoneticIndex(nextPhoneticIndex);
	};

	return (
		<header className="flex justify-between">
			<div>
				<h1 className="text-5xl font-bold">{capitalize(definitions.word)}</h1>
				<div className="flex">
					{/* TODO: animate transition among different phonetics */}
					<p className="text-violet-500">{phonetics[phoneticIndex].text}</p>
					{phonetics.length > 1 && (
						<button className="border border-red-500 p-1" onClick={handleClick}>
							{phoneticIndex}
						</button>
					)}
				</div>
			</div>
			{/* TODO: animate mound and unmount */}
			{phonetics[phoneticIndex].audioUrl && <button>Play</button>}
		</header>
	);
};

export const ResultView = ({
	definitions,
}: {
	definitions: WordDefinitions;
}) => {
	return (
		<article>
			<Header definitions={definitions} />
		</article>
	);
};

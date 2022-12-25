import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Leaderboard</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-200">
      <div className="container flex max-w-5xl flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-6xl font-bold sm:text-[6rem]">Top Three</h1>
        <Podium />
        <Link
          href="/leaderboard"
          className="rounded-full bg-slate-700 py-2 px-5 text-xl"
        >
          Leaderboard
        </Link>
      </div>
    </main>
  </>
);

const Podium = () => {
  const { data } = trpc.getTopThree.useQuery();
  if (!data) return <h2 className="text-2xl font-bold">Loading...</h2>;
  if (data.length < 3)
    return <h2 className="text-2xl font-bold">Not Enough Data</h2>;
  return (
    <div className="grid w-full grid-cols-3 items-end gap-3">
      <Card name={data[1]?.name} score={data[1]?.score} rank={2} />
      <Card name={data[0]?.name} score={data[0]?.score} rank={1} />
      <Card name={data[2]?.name} score={data[2]?.score} rank={3} />
    </div>
  );
};

type CardProps = {
  name?: string;
  score?: number;
  rank: 1 | 2 | 3;
};

const ranks = {
  1: {
    text: "1st",
    color: "bg-amber-500",
    height: "h-64 sm:h-96",
  },
  2: {
    text: "2nd",
    color: "bg-slate-500",
    height: "h-52 sm:h-80",
  },
  3: {
    text: "3rd",
    color: "bg-amber-800",
    height: "h-48 sm:h-64",
  },
};

const Card = ({ name, score, rank }: CardProps) => (
  <div className="text-center">
    <h2 className="mb-3 text-2xl font-bold">{ranks[rank].text}</h2>
    <div
      className={
        "flex flex-col items-center justify-center gap-3 rounded-lg p-4 " +
        ranks[rank].color +
        " " +
        ranks[rank].height
      }
    >
      <h3 className="text-2xl font-semibold sm:text-4xl">
        {name?.toUpperCase()}
      </h3>
      <p className="text-xl font-semibold">{score}</p>
    </div>
  </div>
);

export default Home;

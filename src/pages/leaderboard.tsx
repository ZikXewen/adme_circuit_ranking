import Head from "next/head";
import { trpc } from "../utils/trpc";

const Leaderboard = () => (
  <>
    <Head>
      <title>Leaderboard</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-200">
      <div className="container flex max-w-5xl flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-6xl font-bold sm:text-[6rem]">Leaderboard</h1>
        <Table />
      </div>
    </main>
  </>
);

const Table = () => {
  const { data } = trpc.getAll.useQuery();

  if (!data) return <h2 className="text-2xl font-bold">Loading...</h2>;
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full bg-slate-700 text-left">
        <thead className="bg-slate-500 text-xs uppercase">
          <tr>
            <th className="py-2 px-6">Rank</th>
            <th className="py-2 px-6">Name</th>
            <th className="py-2 px-6">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-slate-600 hover:bg-slate-600"
            >
              <td className="py-3 px-6">{index + 1}</td>
              <td className="py-3 px-6">{item.name}</td>
              <td className="py-3 px-6">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

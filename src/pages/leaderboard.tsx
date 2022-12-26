import type { Player } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

type Props = {
  isAdmin: boolean;
};

const Leaderboard: NextPage<Props> = (props) => (
  <>
    <Head>
      <title>Leaderboard</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main
      className="flex min-h-screen flex-col items-center justify-center text-slate-200"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/background.png')",
      }}
    >
      <div className="container flex max-w-5xl flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-6xl font-bold sm:text-[6rem]">Leaderboard</h1>
        <Table {...props} />
      </div>
    </main>
  </>
);

const Table = ({ isAdmin }: Props) => {
  const [newData, setNewData] = useState<Player[]>([]);
  const [saving, setSaving] = useState(false);
  const { data, refetch, isError, isFetching } = trpc.getAll.useQuery(
    undefined,
    {
      onSuccess: (data) => setNewData(data),
    }
  );
  const { mutateAsync: update } = trpc.update.useMutation();
  const { mutateAsync: remove } = trpc.remove.useMutation();
  const { mutateAsync: create } = trpc.create.useMutation();

  const calculateAndMutate = async () => {
    if (data === undefined) return;
    setSaving(true);
    const promises: Promise<Player>[] = [];
    let j = 0;
    for (let i = 0; i < newData.length; i++) {
      const nd = newData[i];
      if (!nd) {
        setSaving(false);
        throw new Error("Invalid data");
      }
      while (nd.id !== data[j]?.id) {
        const id = data[j]?.id;
        if (!id) break;
        promises.push(remove({ id }));
        j++;
      }
      if (j >= data.length)
        promises.push(create({ name: nd.name, score: nd.score }));
      else {
        const d = data[j];
        if (!d) {
          setSaving(false);
          throw new Error("Invalid data");
        }
        if (d.name !== nd.name || d.score !== nd.score)
          promises.push(update({ id: d.id, name: nd.name, score: nd.score }));
        j++;
      }
    }
    while (j < data.length) {
      const id = data[j]?.id;
      if (!id) break;
      promises.push(remove({ id }));
      j++;
    }
    await Promise.all(promises);
    setSaving(false);
    refetch();
  };

  if (isError) return <h2 className="text-2xl font-bold">Error</h2>;
  if (isFetching) return <h2 className="text-2xl font-bold">Loading...</h2>;
  if (!isAdmin && (!data || data.length === 0))
    return <h2 className="text-2xl font-bold">No data</h2>;

  return (
    <>
      {isAdmin && (
        <>
          <div className="grid w-full grid-cols-3 gap-4">
            <button
              className="col-span-2 rounded bg-emerald-500 py-2 px-4 font-bold hover:bg-emerald-600"
              onClick={calculateAndMutate}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="rounded bg-red-500 py-2 px-4 font-bold hover:bg-red-600"
              onClick={() => setNewData(data || [])}
            >
              Reset
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              className="h-8 w-8 rounded-full bg-slate-500 text-center align-middle text-lg font-bold leading-8 hover:bg-slate-600"
              onClick={() =>
                setNewData([
                  ...newData,
                  {
                    id: "unassigned" + Math.random().toString(),
                    name: "",
                    score: 0,
                  },
                ])
              }
            >
              +
            </button>
          </div>
        </>
      )}
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full bg-slate-700 text-left">
          <thead className="bg-slate-500 text-xs uppercase">
            <tr>
              <th className="py-2 px-6">Rank</th>
              <th className="py-2 px-6">Name</th>
              <th className="py-2 px-6">Score</th>
              {isAdmin && <th className="py-2 px-6">Remove</th>}
            </tr>
          </thead>
          <tbody>
            {newData.map(({ id, name, score }, index) => (
              <tr
                key={id}
                className="border-b border-slate-600 hover:bg-slate-600"
              >
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">
                  {isAdmin ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setNewData(
                          newData.map((player) =>
                            player.id === id
                              ? { ...player, name: e.target.value }
                              : player
                          )
                        )
                      }
                      className="w-full bg-transparent"
                    />
                  ) : (
                    name
                  )}
                </td>
                <td className="py-3 px-6">
                  {isAdmin ? (
                    <input
                      type="number"
                      value={score}
                      onChange={(e) =>
                        setNewData(
                          newData.map((player) =>
                            player.id === id
                              ? {
                                  ...player,
                                  score: Number(e.target.value) || 0,
                                }
                              : player
                          )
                        )
                      }
                      className="w-full bg-transparent"
                    />
                  ) : (
                    score
                  )}
                </td>
                {isAdmin && (
                  <td className="py-3 px-6">
                    <button
                      className="h-8 w-8 rounded-full bg-slate-500 text-center align-middle text-lg font-bold leading-8 hover:bg-slate-600"
                      onClick={() =>
                        setNewData(newData.filter((player) => player.id !== id))
                      }
                    >
                      -
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    isAdmin: query.key === process.env.ADMIN_KEY,
  },
});

export default Leaderboard;

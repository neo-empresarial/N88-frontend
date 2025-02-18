import { getSession } from "@/lib/session";

export default async function Profile() {
  const session = await getSession();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

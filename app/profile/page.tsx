import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/options"

export default async function Page() {
  const session = await getServerSession(authOptions)
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
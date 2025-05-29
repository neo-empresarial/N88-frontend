import { getSession } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// const session = {
//   user: {
//     id: "2",
//     name: "Gustavo Torres",
//     email: "gustavo@gmail.com",
//   },
//   iat: 1748365008,
//   exp: 1748969808,
// };

export default async function Profile() {
  const session = await getSession();
  console.log("session", session);
  // const { data: groups, isLoading } = useQuery({
  //   queryKey: ["groups", session?.user?.id],
  //   queryFn: async () => {
  //     const response = await fetch(`/api/groups?userId=${session?.user?.id}`);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch groups");
  //     }
  //     return response.json();
  //   },
  //   enabled: !!session?.user?.id,
  // });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-sm">{session?.user?.name}</p>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm">{session?.user?.email}</p>
              <p className="text-sm text-gray-500">Grupo de estudos</p>
              {/* <p className="text-sm">{groups?.length}</p> */}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Criar grupo de estudos</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

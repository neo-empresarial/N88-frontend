import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Plus, UserPlus, Users } from '@geist-ui/icons'
import CreateGroupDialog from "@/components/create-group-dialog";

const Groups = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="grid grid-cols-2 gap-2 w-2/3 h-2/3">
        <div className="flex flex-col h-full bg-gray-500 rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2">
            <h1 className="text-2xl font-bold">Seus grupos de estudos</h1>
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-col h-full bg-gray-500 rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2">
            <h1 className="text-2xl font-bold">Crie um grupo de estudos</h1>
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <CreateGroupDialog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;

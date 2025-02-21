import FloattingButton from "@/components/floatting-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSession } from "@/lib/session";
import { MessageSquare } from "lucide-react";
import { useFormState } from "react-dom";
import { sendFeedback } from "./useFeedbackForm";

const FormContent = () => {
  const [state, action] = useFormState(sendFeedback, undefined);

  return (
    <form className="grid gap-2 w-full" action={action}>
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <Label htmlFor="message" className="text-base">
        Seu feedback é muito importante!
      </Label>
      <Textarea
        placeholder="Abra seu coração ❤️"
        id="message"
        className="h-32"
        name="message"
      />
      {state?.error?.message && (
        <p className="text-sm text-red-500">{state.error.message}</p>
      )}

      <Button type="submit">Enviar</Button>
    </form>
  );
};

async function FeedbackForm() {
  const session = await getSession();
  return (
    session && (
      <FloattingButton
        icon={<MessageSquare size={25} />}
        content={<FormContent />}
      />
    )
  );
}

export default FeedbackForm;

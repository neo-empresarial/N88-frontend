import FloattingButton from "@/components/floatting-button";
import { getSession } from "@/lib/session";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

async function FeedbackButton() {
  const session = await getSession();
  return (
    session && (
      <FloattingButton
        icon={<MessageSquare size={25} />}
        content={<FeedbackForm />}
      />
    )
  );
}

export default FeedbackButton;

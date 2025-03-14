﻿import FloattingButton from "@/components/floatting-button";
import { getSession } from "@/lib/session";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

async function FeedbackButton() {
  return (
    <FloattingButton
      icon={<MessageSquare size={25} />}
      content={<FeedbackForm />}
    />
  );
}

export default FeedbackButton;

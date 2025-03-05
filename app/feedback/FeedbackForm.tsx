"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "react-dom";
import { sendFeedback } from "./useFeedbackForm";
import SubmitButton from "@/components/submit-button";
import { useEffect, useRef } from "react";

const FeedbackForm = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [state, action] = useFormState(sendFeedback, undefined);

  useEffect(() => {
    if (state?.success && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state]);

  return (
    <form className="grid gap-2" action={action}>
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <Label htmlFor="message" className="text-base">
        Seu feedback é muito importante!
      </Label>

      {state?.success && (
        <p className="text-sm text-green-600">Muito obrigado!</p>
      )}

      <Textarea
        placeholder="Abra seu coração ❤️"
        id="message"
        className="h-32"
        name="message"
        ref={inputRef}
      />
      {state?.error?.message && (
        <p className="text-sm text-red-500">{state.error.message}</p>
      )}

      <SubmitButton>Enviar feedback</SubmitButton>
    </form>
  );
};

export default FeedbackForm;

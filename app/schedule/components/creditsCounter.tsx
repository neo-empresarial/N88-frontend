import React from "react";
import { useSubjects } from "../providers/subjectsContext";

const CreditsCounter = () => {
  const {
    totalCredits,
  } = useSubjects();

  return (
    <div>
      <h1 className="justify-self-end">{`Créditos totais: ${totalCredits}`}</h1>
    </div>
  );
};

export default CreditsCounter;

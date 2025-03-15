import React, { useEffect, useState } from "react";
import { useSubjects } from "../providers/subjectsContext";
import { SubjectsType } from "../types/dataType";

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

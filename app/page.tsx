"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import grade from "./assets/grade.png";
import materias from "./assets/materias.png";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { motion } from "motion/react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="flex flex-col items-center justify-center w-full ">
        <motion.div
          className="w-full h-100 flex items-center justify-center flex-col"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: -30, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Badge variant="outline">Development by NEO Empresarial</Badge>
          <h1 className="text-6xl font-sans font-medium">Uma nova forma </h1>
          <h1 className="text-6xl font-sans font-medium">
            de montar a sua grade
          </h1>
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center w-full mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>
            Construa sua grade curricular, salve um histórico, avalie a
            dificuldade das matérias,
          </p>
          <p>tudo em um mesmo lugar.</p>
        </motion.div>
          <motion.div
            className="flex flex-col items-center justify-center w-full mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image src={grade} alt="grade" width={500} height={500} />
          </motion.div>
          {/* <Image
            className="absolute bottom-20 left-30"
            src={materias}
            alt="grade"
            width={300}
            height={300}
          /> */}
      </div>
    </div>
  );
}

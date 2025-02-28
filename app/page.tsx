"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import grade from "./assets/grade.png";
import materias from "./assets/materias.png";
import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const [fade, setFade] = useState(0);

  useEffect(() => {
    // Subscribe to scroll progress
    scrollYProgress.onChange((value) => {
      // Map the scroll value to a fade effect
      setFade(value);
    });
  }, [scrollYProgress]);

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center w-full mt-[10%]">
        <motion.div
          className="w-full h-50 flex items-center justify-center flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
      </div>

      <div
        className="grid grid-cols-2 items-center space-x-12 justify-center w-full mb-10 overflow-y-auto p-10"
        style={{
          background: `linear-gradient(to bottom, rgba(179, 179, 204, 0) 0%, rgba(179, 179, 204, ${fade}) 100%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl bg-[#020817] flex flex-col items-center justify-center gap-4"
        >
          <h1 className="text-6xl font-sans font-medium">Avalie as matérias</h1>
          <Image src={materias} alt="materias" width={500} height={500} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl bg-[#020817] flex flex-col items-center justify-center gap-4"
        >
          <h1 className="text-6xl font-sans font-medium w-full align-middle text-center">
            Avalie os professores
          </h1>
          <Image src={materias} alt="materias" width={500} height={500} />
        </motion.div>
      </div>
    </div>
  );
}

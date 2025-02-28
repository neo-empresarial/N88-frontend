"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import grade from "./assets/grade.png";
import materias from "./assets/materias.png";
import logo from "./assets/logo-neo.svg";
import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Github,
  Edit2,
  Instagram,
  Globe,
  BarChart,
  Save,
  Coffee,
  User,
} from "@geist-ui/icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const [fade, setFade] = useState(0);
  const [displayText, setDisplayText] = useState("qualquer curso");
  const [hoveredItem, setHoveredItem] = useState(null);

  const defaultText = "qualquer curso";

  const items = [
    { label: "CTC", text: "engenharia" },
    { label: "CCS", text: "saúde" },
    { label: "CSE", text: "administração" },
    { label: "CFH", text: "filosofia" },
    { label: "CCB", text: "ciências biológicas" },
    { label: "CCE", text: "expressão" },
  ];

  const people = [
    "Gustavo Torres",
    "Kaique Valentim Souza",
    "Caio Eduardo Feuser",
  ];

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
          whileInView="visible"
          viewport={{ once: true }}
          initial={{ transform: "translateY(150px)" }}
          animate={{ transform: "translateY(-30px)" }}
          transition={{ duration: 0.5 }}
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
        className="grid grid-cols-2 items-center  gap-4 m-20"
        // style={{
        //   background: `linear-gradient(to bottom, rgba(179, 179, 204, 0) 0%, rgba(179, 179, 204, ${fade}) 100%)`,
        // }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl dark:bg-[#020817] flex flex-col items-center justify-center gap-4 h-full"
        >
          <div className="flex gap-2 items-center ">
            <BarChart />
            <h1 className="text-2xl font-sans font-medium">
              Calcule a dificuldade da sua grade
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            A plataforma avalia em tempo real a dificuldade da sua grade baseado
            em diversos critérios, como a taxa de reprovação das matérias.
          </p>
          <div>
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-5xl font-sans text-red-400">27%</h1>
              <p className="">é a taxa média de reprovação da sua grade</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl dark:bg-[#020817] flex flex-col items-center justify-center gap-4 h-full"
        >
          <div className="flex gap-2 items-center ">
            <Save />
            <h1 className="text-2xl font-sans font-medium">
              Salve a sua grade no seu perfil
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            Pela plataforma você tem a opcão de salvar sua grade diretamente no
            perfil, além de ter um histórico de todas as grades que você já
            montou.
          </p>
          <div className="flex flex-col items-left justify-center">
            <h1 className="text-3xl font-sans">Seu histórico de grades:</h1>
            <div className="flex flex-row gap-2 justify-center items-center mt-5">
              <p className="text-[#898989] hover:text-black hover:bg-gray-200 hover:dark:text-[#FAFAFA] transition-colors p-2 dark:bg-gray-800 rounded-md hover:dark:bg-gray-700">
                2025.1
              </p>
              <p className="text-[#898989] hover:text-black hover:bg-gray-200 hover:dark:text-[#FAFAFA] transition-colors p-2 dark:bg-gray-800 rounded-md hover:dark:bg-gray-700">
                2025.2
              </p>
              <p className="text-[#898989] hover:text-black hover:bg-gray-200 hover:dark:text-[#FAFAFA] transition-colors p-2 dark:bg-gray-800 rounded-md hover:dark:bg-gray-700">
                2026.1
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl dark:bg-[#020817] flex flex-col items-center justify-center gap-4 h-full w-full m-0"
        >
          <div className="flex gap-2 items-center ">
            <Coffee />
            <h1 className="text-2xl font-sans font-medium">
              Personalize o seu ambiente
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            Deixa a plataforma da forma que mais te agrada, com temas
            personalizados e opções de acessibilidade.
          </p>
          <div>
            <ResizablePanelGroup
              direction="horizontal"
              className="max-w-md rounded-lg border md:min-w-[450px]"
            >
              <ResizablePanel defaultSize={50}>
                <div className="flex h-[200px] items-center justify-center p-6">
                  <span className="font-semibold">Grade</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={25}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Matérias</span>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Professores</span>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl dark:bg-[#020817] flex flex-col items-center justify-center gap-4 h-full"
        >
          <div className="flex gap-2 items-center ">
            <Coffee />
            <h1 className="text-2xl font-sans font-medium">
              Compartilhe sua grade com qualquer um
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            Compartilhar a grade com outros graduandos nunca foi tão fácil!
            Adicione pessoas na plataforma e veja em tempo real a grade deles.
          </p>
          <div className="flex flex-row items-center gap-4">
            <div className="text-2xl font-sans font-semibold">
              <h1>Comparar grade</h1>
            </div>
            <div className="flex flex-col gap-2">
              {people.map((name) => (
                <div key={name} className="relative group">
                  {/* Name text with right padding so it doesn't overlap the button */}
                  <p className="pr-12 text-[#898989] group-hover:text-black group-hover:dark:text-[#FAFAFA] transition-colors cursor-pointer">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-20">
        <motion.div
          className="flex flex-row items-center justify-center w-full mb-10 gap-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="flex flex-col items-left">
            <h1 className="text-4xl text-[#898989]">Monte a sua grade para</h1>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              key={displayText}
            >
              <h1 className="text-4xl dark:text-[#FAFAFA] font-semibold">
                {displayText}
              </h1>
            </motion.div>
          </div>
          <div className="flex flex-row gap-0">
            {items.map((item) => {
              const isHovered = hoveredItem === item.label;
              let textColorClass = "text-[#898989]";
              if (isHovered) {
                textColorClass = "text-[#FAFAFA]";
              } else if (hoveredItem) {
                textColorClass = "text-[#5a5a5a]";
              }

              return (
                <span
                  key={item.label}
                  onMouseEnter={() => {
                    setHoveredItem(item.label);
                    setDisplayText(item.text);
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setDisplayText(defaultText);
                  }}
                  className={`text-4xl font-semibold p-2 transition-colors duration-300 ${textColorClass}`}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-40 ">
        <motion.div
          className="flex flex-col items-center justify-center w-full mb-10 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
        >
          <h1 className="text-4xl dark:text-[#FAFAFA] font-sans">
            Faça do MatrUFSC 2.0 cada vez melhor
          </h1>
          <div className="flex flex-col items-center justify-center w-full gap-1">
            <p className="text-[#898989]">
              A missão da plataforma é estar cada vez mais adaptada a
              necessidade dos estudantes
            </p>
            <p className="text-[#898989]">
              Contribua para melhorar cada vez mais a ferramenta
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button variant="outline" className="gap-2">
              <p>Contribua com feedback</p>
              <Edit2 />
            </Button>
            <Link href="https://github.com/neo-empresarial/N88-frontend">
              <Button variant="outline" className="gap-2">
                <p>Github</p>
                <Github />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-20 bg-black">
        <div>
          <h1 className="text-2xl font-light font-sans text-[#898989] p-4">
            Aplicativo desenvolvido e mantido pelo{" "}
            <span className="text-white">NEO Empresarial</span>
          </h1>
          <Separator className="" />
        </div>
        <div className="flex flex-row m-4 justify-between items-center gap-20">
          <div className="flex flex-row items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="grade" width={50} height={50} />
            </div>
            <div className="flex flex-col text-white">
              <h1 className="text-2xl ">NEO Empresrial</h1>
              <p>Capacitando engenheiros, mudando o futuro.</p>
              <div className="flex gap-2 mt-2">
                <Instagram />
                <Globe />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 p-4 text-white">
            <Link href="https://neo.certi.org.br/">
              <p>Home</p>
            </Link>
            <Link href="https://neo.certi.org.br/sobre-nos">
              <p>Sobre o NEO</p>
            </Link>
            <Link href="https://neo.certi.org.br/equipe">
              <p>Equipe</p>
            </Link>
            <Link href="https://neo.certi.org.br/projetos">
              <p>Projetos</p>
            </Link>
            <Link href="https://neo.certi.org.br/trabalhe-conosco">
              <p>Trabalhe no NEO</p>
            </Link>
            <Link href="https://neo.certi.org.br/conteudos">
              <p>Conteúdos</p>
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#898989] mb-10">
            Todos os direitos resevados.
          </p>
        </div>
      </div>
    </div>
  );
}

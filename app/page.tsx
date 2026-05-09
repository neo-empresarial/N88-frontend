"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import lightModeImage from "./assets/N88-light-mode.png";
import darkModeImage from "./assets/N88-dark-mode.png";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Github,
  BarChart,
  Save,
  Coffee,
} from "@geist-ui/icons";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useMediaQuery from "./hooks/useMediaQuery";
import { useMemo } from "react";
import { useTheme } from "next-themes";

export default function Home() {
  const [displayText, setDisplayText] = useState("qualquer curso");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const defaultText = "qualquer curso";
  
  const { theme, resolvedTheme } = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const indexRef = useRef(0);
  const wasSmallScreenRef = useRef(isSmallScreen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme ?? theme) : 'light';
  const gradeImage = currentTheme === 'dark' ? darkModeImage : lightModeImage;


  const items = useMemo(
    () => [
      { id: 1, label: "CTC", text: "engenharia" },
      { id: 2, label: "CCS", text: "saúde" },
      { id: 3, label: "CSE", text: "socioeconômicas" },
      { id: 4, label: "CFH", text: "filosofia e humanas" },
      { id: 5, label: "CCB", text: "ciências biológicas" },
      { id: 6, label: "CCE", text: "expressão" },
      { id: 7, label: "CCJ", text: "jurídicas"},
    ],
    []
  );

  const people = [
    "Gustavo",
    "Kaique",
    "Caio ",
  ];

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isSmallScreen) {
      intervalId = setInterval(() => {
        setHoveredItem(items[indexRef.current].label);
        setDisplayText(items[indexRef.current].text);
        indexRef.current = (indexRef.current + 1) % items.length;
      }, 2000);
    } else {
      if (wasSmallScreenRef.current === true) {
        setHoveredItem(null);
        setDisplayText(defaultText);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSmallScreen, items, defaultText]);

  const handleMouseEnter = (itemLabel: string, itemText: string) => {
    if (!isSmallScreen) {
      setHoveredItem(itemLabel);
      setDisplayText(itemText);
    }
  };

  const handleMouseLeave = () => {
    if (!isSmallScreen) {
      setHoveredItem(null);
      setDisplayText(defaultText);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center w-full lg:mt-[10%] mt-[30%]">
        <motion.div
          className="w-full h-50 flex items-center justify-center flex-col"
          whileInView="visible"
          viewport={{ once: true }}
          initial={{ transform: "translateY(150px)" }}
          animate={{ transform: "translateY(-30px)" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline">Desenvolvido pelo NEO Empresarial com ❤️</Badge>
          <h1 className=" text-4xl md:text-5xl lg:text-6xl font-sans font-medium ">
            Uma nova forma{" "}
          </h1>
          <h1 className=" text-4xl md:text-5xl lg:text-6xl font-sans font-medium sm:text4xl ">
            de montar a sua grade
          </h1>
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center w-full mb-10 text-xs sm:text-sm md:text-base lg:text-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>
            Construa sua grade curricular, analise a concorrência histórica das matérias,
          </p>
          <p>compartilhe com os amigos, tudo em um mesmo lugar!</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center w-full mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={gradeImage}
            alt="Interface do Gradi"
            width={850}
            height={850}
            className="h-auto lg:w-auto w-80 transition-opacity duration-300"
            priority
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 m-4 md:grid-cols-2 md:m-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="border border-grey-200 p-10 rounded-xl dark:bg-[#020817] flex flex-col items-center justify-center gap-4 h-full"
        >
          <div className="flex gap-2 items-center ">
            <BarChart />
            <h1 className="text-2xl font-sans font-medium">
              Analise a concorrência histórica das matérias
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            Descubra a demanda real por cada matéria baseado no histórico de matrículas. 
            Nossa plataforma calcula a média de pedidos de matrícula versus vagas disponíveis 
            nos últimos semestres, te ajudando a planejar melhor sua grade.
          </p>
          <div>
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-5xl font-sans text-orange-400">2.3x</h1>
              <p className="">mais pedidos de matrícula que vagas disponíveis</p>              
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
            Chega de perder seu planejamento de matérias entre semestres! 
            Salve sua grade diretamente no perfil e tenha acesso ao histórico 
            completo de todas as grades que você já montou.
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
              Personalize o layout da sua grade
            </h1>
          </div>
          <p className="text-[#898989] text-center">
            Organize sua grade da forma que mais te agrada. Redimensione e reorganize 
            as seções de matérias, professores e informações para criar o ambiente 
            perfeito para seu planejamento acadêmico.
          </p>
          <div className='w-full h-full p-2'>
            <ResizablePanelGroup
              direction="horizontal"
              className="rounded-lg border w-full h-full"
            >
              <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Matérias</span>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <span className="font-semibold">Professores</span>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-[200px] items-center justify-center p-6">
                  <span className="font-semibold">Grade</span>
                </div>
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
          <div className="flex flex-row items-center gap-4 h-full">
            <div className="text-2xl font-sans font-semibold">
              <h1>Compartilhar grade com</h1>
            </div>
            <div className="flex flex-col gap-2">
              {people.map((name) => (
                <div key={name} className="relative group">
                  <p className="pr-12 text-[#898989]  group-hover:text-black group-hover:dark:text-[#FAFAFA] transition-colors cursor-pointer">
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
          className="flex flex-col gap-4 w-full mb-10 md:flex-row md:gap-20 md:items-center md:justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <div className="flex flex-col items-center lg:items-left">
            <h1 className="text-2xl lg:text-4xl text-[#898989]">
              Monte a sua grade para
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              key={displayText}
            >
              <h1 className="text-2xl lg:text-4xl lg:text-left dark:text-[#FAFAFA] font-semibold">
                {displayText}
              </h1>
            </motion.div>
          </div>
          <div className="flex flex-row gap-0 justify-center lg:justify-start">
            {items.map((item, index, array) => {
              const isHovered = hoveredItem === item.label;
              let textColorClass = "text-[#898989]";
              if (isHovered) {
                textColorClass = "dark:text-[#FAFAFA]";
              } else if (hoveredItem) {
                textColorClass = "text-[#5a5a5a]";
              }

              return (
                <span
                  key={item.label}
                  onMouseEnter={() => {
                    handleMouseEnter(item.label, item.text);
                  }}
                  onMouseLeave={handleMouseLeave}
                  className={`text-2xl lg:text-4xl font-semibold p-2 transition-colors duration-300 ${textColorClass}`}
                >
                  {item.label}
                  {index === array.length - 1 && (
                    <span className="text-[#898989] ml-2">...</span>
                  )}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-[8rem] ">
        <motion.div
          className="flex flex-col items-center justify-center w-full mb-10 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-4xl dark:text-[#FAFAFA] font-sans">
            Faça do Gradi cada vez melhor
          </h1>
          <div className="flex flex-col items-center justify-center w-full gap-1 text-sm lg:text-base text-center">
            <p className="text-[#898989]">
              A missão da plataforma é estar cada vez mais adaptada a
              necessidade de nós estudantes.
            </p>
            <p className="text-[#898989]">
              Contribua para melhorar cada vez mais a ferramenta!
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Link href="https://github.com/neo-empresarial/N88-frontend">
              <Button variant="outline" className="gap-2">
                <p>Github</p>
                <Github />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

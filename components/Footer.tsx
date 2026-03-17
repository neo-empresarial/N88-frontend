import Image from "next/image";
import Link from "next/link";
import { Github, Instagram, Globe } from "@geist-ui/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import logo from "@/app/assets/logo-neo.svg";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-20 bg-black">
      <div>
        <h1 className="text-xl text-center lg:text-2xl font-light font-sans text-[#898989] p-4">
          Aplicativo desenvolvido e mantido pelo{" "}
          <span className="text-white">NEO Empresarial</span>
        </h1>
        <Separator className="" />
      </div>
      <div className="flex flex-col lg:flex-row m-4 lg:justify-between items-center lg:gap-20">
        <div className="flex flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="grade" width={50} height={50} />
          </div>
          <div className="flex flex-col text-white">
            <h1 className="text-lg lg:text-2xl ">NEO Empresarial</h1>
            <p className="text-sm">
              Capacitando engenheiros, mudando o futuro.
            </p>
            <div className="flex gap-2 mt-2">
              <Link href="https://www.instagram.com/neo.empresarial/">
                <Instagram />
              </Link>
              <Link href="https://neo.certi.org.br/">
                <Globe />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 p-4 text-white text-xs">
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
  );
}
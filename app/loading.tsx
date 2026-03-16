import Image from "next/image";
import logo from "./assets/logo-neo.svg";
import BlackLogo from "./assets/black-logo.svg";

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center min-h-[60vh]">
      <div className="relative h-16 w-16 animate-spin">
        <Image
          src={logo}
          alt="Loading..."
          fill
          className="hidden dark:block object-contain"
          priority
        />
        <Image
          src={BlackLogo}
          alt="Loading..."
          fill
          className="block dark:hidden object-contain"
          priority
        />
      </div>
    </div>
  );
}

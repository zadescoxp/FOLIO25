import { ConfettiFireworks } from "./UI/hello";
import Logo from "./UI/Logo";
import TextAnimation from "./UI/TextAnimation";

export default function Hero() {
  return <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
    <div className="pt-6 sm:pt-8 md:pt-10 flex w-full items-baseline justify-between"><Logo className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl" />
      <ConfettiFireworks>Say Hello</ConfettiFireworks>
    </div>

    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] xl:text-[5rem] 2xl:text-[5.5rem] leading-none font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mt-16 sm:mt-24 md:mt-32 lg:mt-48 xl:mt-52">
      <TextAnimation text="Full-stack developer crafting clean, impactful and creative products" className="text-shadow-lg" />
    </div>

    <div className="mt-16 sm:mt-24 md:mt-32 lg:mt-48 xl:mt-52 w-full">
      <video src="/video.mp4" controls={false} autoPlay muted loop className="rounded-xl sm:rounded-2xl shadow-lg w-full"></video>
      <TextAnimation text="Scaled Vouz to 2,000+ users within the first day" className="text-xs sm:text-sm mt-2 text-neutral-600" />
    </div>
  </div>;
}

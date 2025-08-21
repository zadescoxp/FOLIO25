import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "./magicui/interactive-grid-pattern";
import TextAnimation from "./UI/TextAnimation";

export default function Statement() {
    return (
        <div className="flex items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-10 relative h-screen bg-neutral-950 text-white">
            <InteractiveGridPattern
                className={cn(
                    "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] h-full w-full",
                )}
                width={30}
                height={30}
                squares={[80, 80]}
                squaresClassName="hover:fill-blue-500"
            />
            <TextAnimation text="Behind every smooth product is countless hours of persistence." className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] font-bold text-center text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl" />
        </div>
    )
}
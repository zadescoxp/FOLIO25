import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "./magicui/interactive-grid-pattern";
import TextAnimation from "./UI/TextAnimation";

export default function Statement() {
    return (
        <div className="flex items-center justify-center w-full px-10 relative h-screen bg-neutral-950 text-white">
            <InteractiveGridPattern
                className={cn(
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] h-full w-full",
                )}
                width={30}
                height={30}
                squares={[80, 80]}
                squaresClassName="hover:fill-blue-500"
            />
            <TextAnimation text="Behind every smooth product is countless hours of persistence." className="w-[75%] font-bold text-center text-8xl" />
        </div>
    )
}
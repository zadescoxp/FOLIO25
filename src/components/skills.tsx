import TextAnimation from "./UI/TextAnimation";

export default function Skills() {
    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] leading-none font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                <TextAnimation text="Skills I’ve honed to deliver results for my clients" />
            </div>

            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                    {skills.map((skill, index) => (
                        <span key={index} className="flex items-center justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 border-b-2 border-neutral-200 pb-6 sm:pb-8 md:pb-10">
                            <TextAnimation text={(index + 1) > 9 ? String(index + 1) : "0" + String(index + 1)} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-600" />
                            <TextAnimation text={skill} className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium" />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

const skills = [
    "Scalable web applications",
    "Structured design systems",
    "Interactive UI prototypes",
    "High-impact MVPs",
    "Automated testing & workflows",
    "Visual identity & branding",
    "AI-powered automations",
    "Data & ML-driven features",
    "Product-driven engineering",
    "Performance-focused optimizations"
]
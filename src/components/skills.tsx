import TextAnimation from "./UI/TextAnimation";

export default function Skills() {
    return (
        <div className="w-full px-10">
            <div className="text-[4.5rem] leading-none font-semibold w-2/3 mt-48">
                <TextAnimation text="Skills I’ve honed to deliver results for my clients" className="text-shadow-lg" />
            </div>

            <div className="">
                <div className="grid grid-cols-2 gap-10 mt-48">
                    {skills.map((skill, index) => (
                        <span key={index} className="flex items-center justify-start gap-10 border-b-2 border-neutral-200 pb-10">
                            <TextAnimation text={(index + 1) > 9 ? String(index + 1) : "0" + String(index + 1)} className="text-6xl font-bold text-neutral-600" />
                            <TextAnimation text={skill} className="text-4xl font-medium" />
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
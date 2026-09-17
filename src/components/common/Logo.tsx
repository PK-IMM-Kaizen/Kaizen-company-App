import Image from "next/image";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "white";
    src?: string;
}

const sizeConfig = {
    sm: {
        img: "w-[36px] h-[36px]",
        text: "text-xs",
        dimension: 36,
    },
    md: {
        img: "w-[44px] h-[44px]",
        text: "text-sm",
        dimension: 44,
    },
    lg: {
        img: "w-[60px] h-[60px]",
        text: "text-base",
        dimension: 60,
    },
};

export default function Logo({
                                 size = "md",
                                 variant = "default",
                                 src = "/img/logo.jpg",
                             }: LogoProps) {
    const currentSize = sizeConfig[size];

    return (
        <div className="flex items-center gap-[10px]">
            <Image
                src={src}
                alt="IMM Kaizen Logo"
                width={currentSize.dimension}
                height={currentSize.dimension}
                className={`object-contain flex-shrink-0 ${currentSize.img} ${
                    variant === "white"
                        ? "mix-blend-screen brightness-[1.15]"
                        : "mix-blend-normal"
                }`}
            />

            <div className="leading-tight">
                <div
                    className={`font-display font-extrabold uppercase tracking-[0.04em] ${
                        currentSize.text
                    } ${variant === "white" ? "text-white" : "text-[#111]"}`}
                >
                    IMM Kaizen
                </div>
                <div
                    className={`font-display font-medium text-[0.6rem] tracking-[0.12em] uppercase mt-[1px] ${
                        variant === "white" ? "text-white/65" : "text-[#888]"
                    }`}
                >
                    Komisariat Kaizen
                </div>
            </div>
        </div>
    );
}
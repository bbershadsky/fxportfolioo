"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { Suspense, useEffect, useState } from "react";

import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ChevronRight } from "lucide-react";
import CryptoHoldingsSection from "@/components/CrytoHoldingsSection";
import { DATA } from "@/data/resume";
import DollarPercentageChart from "@/components/DollarPercentageGrowthChart";
import InvestmentSection from "@/components/InvestmentSection";
import { InvestmentsList } from "@/components/InvestmentsList";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import NVDAChart from '../components/NVDAChart';
import ShineBorder from "@/components/ui/shine-border";
import { buttonVariants } from "@/components/ui/button"
import { useTheme } from "next-themes";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const { theme } = useTheme();
  return (
      <main className="flex flex-col min-h-[100dvh] space-y-10">
        <section id="hero">
          <ModeToggle/>
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <div className="gap-2 flex justify-between">
              <div className="flex-col flex flex-1 space-y-1.5">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  yOffset={8}
                  text={"FB7 FTMO 💸"}
                />
                <BlurFadeText
                  className="max-w-[600px] md:text-xl"
                  delay={BLUR_FADE_DELAY}
                  text={DATA.description}
                />
              </div>
              <BlurFade delay={BLUR_FADE_DELAY}>
                <Avatar className="size-28 border">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </BlurFade>
            </div>
        </div>
        
        </section>
     

        
                 
            <section id="investments">
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <InvestmentSection />
              </BlurFade>
            </section>

            <section id="barchart">
              <DollarPercentageChart/>
            </section>

            <section id="work">
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <InvestmentsList />
              </BlurFade>
            </section>
          
      </main>
  );
}

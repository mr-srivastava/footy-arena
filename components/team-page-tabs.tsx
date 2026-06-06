"use client";

import { CalendarDays, Sparkles, TrendingUp, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TEAM_TABS = ["overview", "squad", "fixtures", "form"] as const;
type TeamTab = (typeof TEAM_TABS)[number];

function isTeamTab(value: string | null): value is TeamTab {
  return TEAM_TABS.includes(value as TeamTab);
}

type TeamPageTabsProps = {
  overview: ReactNode;
  squad: ReactNode;
  fixtures: ReactNode;
  form: ReactNode;
};

export function TeamPageTabs({
  overview,
  squad,
  fixtures,
  form,
}: TeamPageTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TeamTab = isTeamTab(tabParam) ? tabParam : "overview";

  function setTab(nextTab: string) {
    if (!isTeamTab(nextTab) || nextTab === activeTab) return;

    const params = new URLSearchParams(searchParams);
    if (nextTab === "overview") params.delete("tab");
    else params.set("tab", nextTab);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={setTab}>
      <div className="sticky top-20 z-30 mb-8 rounded-2xl border border-line-strong bg-background/90 p-2 shadow-card backdrop-blur-xl">
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-x-5 gap-y-2 sm:gap-x-8"
        >
          <TabsTrigger value="overview">
            <Sparkles data-icon="inline-start" aria-hidden />
            Overview
          </TabsTrigger>
          <TabsTrigger value="squad">
            <Users data-icon="inline-start" aria-hidden />
            Squad
          </TabsTrigger>
          <TabsTrigger value="fixtures">
            <CalendarDays data-icon="inline-start" aria-hidden />
            Fixtures
          </TabsTrigger>
          <TabsTrigger value="form">
            <TrendingUp data-icon="inline-start" aria-hidden />
            Form
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0">
        {overview}
      </TabsContent>
      <TabsContent value="squad" className="mt-0">
        {squad}
      </TabsContent>
      <TabsContent value="fixtures" className="mt-0">
        {fixtures}
      </TabsContent>
      <TabsContent value="form" className="mt-0">
        {form}
      </TabsContent>
    </Tabs>
  );
}

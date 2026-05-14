import {
  AlertTriangle,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Euro,
  FileJson,
  Gauge,
  Info,
  MapPin,
  Moon,
  Plus,
  RotateCcw,
  Route,
  Settings2,
  Ship,
  Sparkles,
  Sun,
  Ticket,
  Trash2,
  UserPlus,
  Users,
  WalletCards,
  Waves
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Category = "Youth" | "Adult" | "Senior";

type FerryLeg = {
  id: string;
  from: string;
  to: string;
  date: string;
  operator: string;
  pricePerPerson: string;
  passCovered: boolean;
};

type PricedLeg = FerryLeg & {
  perPerson: number;
  groupPrice: number;
  rawPrice: string;
};

type Traveler = {
  id: string;
  name: string;
  age: string;
};

type TravelerWithCategory = Traveler & {
  numericAge: number;
  category: Category;
  passPrice: number;
};

type PassSettings = {
  youthPrice: string;
  adultPrice: string;
  seniorPrice: string;
  serviceFee: string;
  customGroupPrice: string;
  customServiceFee: string;
};

type PassOption = {
  id: string;
  name: string;
  label: string;
  description: string;
  total: number;
  savings: number;
  coveredLegs: number;
  totalLegs: number;
  warnings: string[];
  editMode?: "interrail" | "custom";
  usesIndividualTotal?: boolean;
};

const greeceExampleLegs: FerryLeg[] = [
  {
    id: "athens-mykonos",
    from: "Athens/Piraeus",
    to: "Mykonos",
    date: "2026-06-03",
    operator: "Blue Star Ferries",
    pricePerPerson: "47",
    passCovered: true
  },
  {
    id: "mykonos-naxos",
    from: "Mykonos",
    to: "Naxos",
    date: "2026-06-06",
    operator: "SeaJets",
    pricePerPerson: "44",
    passCovered: false
  },
  {
    id: "naxos-santorini",
    from: "Naxos",
    to: "Santorini",
    date: "2026-06-09",
    operator: "Hellenic Seaways",
    pricePerPerson: "63",
    passCovered: true
  }
];

const greeceExampleTravelers: Traveler[] = [
  { id: "sofia", name: "Sofia", age: "24" },
  { id: "theo", name: "Theo", age: "35" },
  { id: "maya", name: "Maya", age: "41" },
  { id: "andreas", name: "Andreas", age: "66" }
];

const defaultPassSettings: PassSettings = {
  youthPrice: "89",
  adultPrice: "109",
  seniorPrice: "94",
  serviceFee: "0",
  customGroupPrice: "462",
  customServiceFee: "0"
};

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

const confidenceNotes = [
  "Pass only works with selected ferry operators.",
  "Check ferry times before buying.",
  "Manual prices are used because ferry prices change."
];

const usefulLinks = [
  {
    title: "Interrail Greek Islands Pass",
    description: "Check pass rules, routes, benefits, and current pass details.",
    url: "https://www.interrail.eu/en/interrail-passes/one-country-pass/greece-passes/greek-islands",
    label: "Pass rules"
  },
  {
    title: "Ferryhopper",
    description: "Compare live ferry routes, schedules, operators, and booking prices.",
    url: "https://www.ferryhopper.com/en/",
    label: "Schedules"
  },
  {
    title: "Blue Star Ferries",
    description: "Official booking and itinerary information for Blue Star sailings.",
    url: "https://www.bluestarferries.com/en",
    label: "Operator"
  },
  {
    title: "Hellenic Seaways",
    description: "Official Hellenic Seaways routes, tickets, and travel updates.",
    url: "https://www.hellenicseaways.gr/en-gb/home",
    label: "Operator"
  },
  {
    title: "Seajets",
    description: "High-speed ferry routes for the Cyclades, Crete, and Aegean trips.",
    url: "https://www.seajets.com/",
    label: "Operator"
  },
  {
    title: "Greek Travel Pages ports",
    description: "Look up Greek ferry ports, connections, and published schedules.",
    url: "https://ferries.gtp.gr/greek-ferries/ferry-ports",
    label: "Ports"
  }
];

const operatorSuggestions = [
  { name: "Blue Star Ferries", passCovered: true },
  { name: "Hellenic Seaways", passCovered: true },
  { name: "Anek Lines", passCovered: true },
  { name: "Superfast Ferries", passCovered: true },
  { name: "SeaJets", passCovered: false },
  { name: "Minoan Lines", passCovered: false },
  { name: "Golden Star Ferries", passCovered: false },
  { name: "Fast Ferries", passCovered: false },
  { name: "Dodekanisos Seaways", passCovered: false },
  { name: "Levante Ferries", passCovered: false },
  { name: "Saronic Ferries", passCovered: false },
  { name: "Triton Ferries", passCovered: false }
];

const portSuggestions = [
  "Athens/Piraeus",
  "Rafina",
  "Lavrio",
  "Mykonos",
  "Naxos",
  "Santorini/Thira",
  "Paros",
  "Ios",
  "Milos",
  "Syros",
  "Tinos",
  "Andros",
  "Crete/Heraklion",
  "Crete/Chania",
  "Rhodes",
  "Kos",
  "Patmos",
  "Samos",
  "Lesvos",
  "Chios",
  "Corfu",
  "Zakynthos",
  "Kefalonia",
  "Skiathos",
  "Skopelos",
  "Alonissos"
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [legs, setLegs] = useState<FerryLeg[]>(greeceExampleLegs);
  const [travelers, setTravelers] =
    useState<Traveler[]>(greeceExampleTravelers);
  const [passSettings, setPassSettings] =
    useState<PassSettings>(defaultPassSettings);
  const [expandedPassId, setExpandedPassId] = useState<string | null>("interrail");
  const [statusMessage, setStatusMessage] = useState("");
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const passPriceByCategory = useMemo(
    () => ({
      Youth: parsePrice(passSettings.youthPrice),
      Adult: parsePrice(passSettings.adultPrice),
      Senior: parsePrice(passSettings.seniorPrice)
    }),
    [passSettings]
  );

  const travelersWithCategory = useMemo<TravelerWithCategory[]>(
    () =>
      travelers.map((traveler) => {
        const numericAge = parseAge(traveler.age);
        const category = getCategory(numericAge);

        return {
          ...traveler,
          numericAge,
          category,
          passPrice: passPriceByCategory[category]
        };
      }),
    [passPriceByCategory, travelers]
  );

  const pricedLegs = useMemo<PricedLeg[]>(
    () =>
      legs.map((leg) => {
        const perPerson = parsePrice(leg.pricePerPerson);

        return {
          ...leg,
          perPerson,
          rawPrice: leg.pricePerPerson,
          groupPrice: perPerson * travelersWithCategory.length
        };
      }),
    [legs, travelersWithCategory.length]
  );

  const routeStops = useMemo(() => getRouteStops(legs), [legs]);
  const routeSummary = routeStops.length
    ? routeStops.join(" -> ")
    : "No itinerary yet";

  const individualTotal = useMemo(
    () => pricedLegs.reduce((total, leg) => total + leg.groupPrice, 0),
    [pricedLegs]
  );

  const passengerPassTotal = useMemo(
    () =>
      travelersWithCategory.reduce(
        (total, traveler) => total + traveler.passPrice,
        0
      ),
    [travelersWithCategory]
  );

  const uncoveredLegTotal = useMemo(
    () =>
      pricedLegs.reduce(
        (total, leg) => total + (leg.passCovered ? 0 : leg.groupPrice),
        0
      ),
    [pricedLegs]
  );

  const passOptions = useMemo<PassOption[]>(() => {
    const serviceFee = parsePrice(passSettings.serviceFee);
    const customGroupPrice = parsePrice(passSettings.customGroupPrice);
    const customServiceFee = parsePrice(passSettings.customServiceFee);
    const coveredLegs = pricedLegs.filter((leg) => leg.passCovered).length;
    const uncoveredLegs = pricedLegs.length - coveredLegs;
    const interrailTotal = passengerPassTotal + uncoveredLegTotal + serviceFee;
    const customTotal = customGroupPrice + customServiceFee;

    return [
      {
        id: "individual",
        name: "Individual ferry tickets",
        label: "No pass",
        description:
          "Buy tickets for every ferry leg using the prices entered in the itinerary.",
        total: individualTotal,
        savings: 0,
        coveredLegs: pricedLegs.length,
        totalLegs: pricedLegs.length,
        warnings: [
          "Best when pass coverage is weak or the route uses cheaper local ferries."
        ],
        usesIndividualTotal: true
      },
      {
        id: "interrail",
        name: "Interrail Greek Islands Pass - 4 days",
        label: "Pass option",
        description:
          "Uses traveler age categories, editable pass prices, and adds uncovered ferry legs.",
        total: interrailTotal,
        savings: individualTotal - interrailTotal,
        coveredLegs,
        totalLegs: pricedLegs.length,
        warnings: [
          uncoveredLegs
            ? `${uncoveredLegs} ferry leg${uncoveredLegs === 1 ? "" : "s"} still need separate tickets.`
            : "All itinerary legs are marked as pass-covered.",
          "Confirm each ferry operator before buying."
        ],
        editMode: "interrail"
      },
      {
        id: "custom",
        name: "Custom travel pass",
        label: "Manual pass",
        description:
          "Use this for agency bundles, rail-and-ferry offers, or any pass with a quoted group price.",
        total: customTotal,
        savings: individualTotal - customTotal,
        coveredLegs: pricedLegs.length,
        totalLegs: pricedLegs.length,
        warnings: ["Manual pass cost is used exactly as entered."],
        editMode: "custom"
      }
    ];
  }, [
    individualTotal,
    passengerPassTotal,
    passSettings.customGroupPrice,
    passSettings.customServiceFee,
    passSettings.serviceFee,
    pricedLegs,
    uncoveredLegTotal
  ]);

  const bestOption = useMemo(
    () =>
      passOptions.reduce((best, option) =>
        option.total < best.total ? option : best
      ),
    [passOptions]
  );

  const estimatedSaving = Math.max(0, individualTotal - bestOption.total);
  const invalidLegs = pricedLegs.filter((leg) => leg.rawPrice.trim() === "");
  const travelerIssues = travelersWithCategory.filter(
    (traveler) => !traveler.name.trim() || !traveler.age.trim()
  );

  const shareSummary = [
    `Best option: ${bestOption.name}`,
    `Estimated saving: ${formatCurrency(estimatedSaving)}`,
    `Recommended total: ${formatCurrency(bestOption.total)}`,
    `Individual tickets: ${formatCurrency(individualTotal)}`,
    `Route: ${routeSummary}`,
    `Travelers: ${travelersWithCategory.length}`
  ].join("\n");

  const itineraryJson = JSON.stringify(
    {
      route: routeStops,
      bestOption: {
        name: bestOption.name,
        total: bestOption.total,
        savings: estimatedSaving
      },
      individualTickets: individualTotal,
      passengerPassTotal,
      uncoveredLegTotal,
      travelers: travelersWithCategory,
      ferryLegs: pricedLegs,
      passPrices: passSettings,
      passOptions,
      confidenceNotes
    },
    null,
    2
  );

  function updateLeg<K extends keyof FerryLeg>(
    id: string,
    key: K,
    value: FerryLeg[K]
  ) {
    setLegs((current) =>
      current.map((leg) => (leg.id === id ? { ...leg, [key]: value } : leg))
    );
  }

  function addLeg() {
    setLegs((current) => {
      const lastLeg = current[current.length - 1];
      const from = lastLeg?.to || "Athens/Piraeus";

      return [
        ...current,
        {
          id: createId("leg"),
          from,
          to: "New island",
          date: "",
          operator: "",
          pricePerPerson: "50",
          passCovered: true
        }
      ];
    });
    setStatusMessage("Ferry leg added.");
  }

  function removeLeg(id: string) {
    setLegs((current) => current.filter((leg) => leg.id !== id));
    setStatusMessage("Ferry leg removed.");
  }

  function updateTraveler<K extends keyof Traveler>(
    id: string,
    key: K,
    value: Traveler[K]
  ) {
    setTravelers((current) =>
      current.map((traveler) =>
        traveler.id === id ? { ...traveler, [key]: value } : traveler
      )
    );
  }

  function addTraveler() {
    setTravelers((current) => [
      ...current,
      { id: createId("traveler"), name: "New traveler", age: "30" }
    ]);
    setStatusMessage("Traveler added.");
  }

  function removeTraveler(id: string) {
    setTravelers((current) => current.filter((traveler) => traveler.id !== id));
    setStatusMessage("Traveler removed.");
  }

  function updatePassSetting<K extends keyof PassSettings>(
    key: K,
    value: PassSettings[K]
  ) {
    setPassSettings((current) => ({ ...current, [key]: value }));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(shareSummary);
      setStatusMessage("Comparison summary copied.");
    } catch {
      setStatusMessage("Copy failed. Open the JSON preview to copy manually.");
    }
  }

  function exportItineraryJson() {
    const blob = new Blob([itineraryJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "travel-pass-itinerary.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Itinerary JSON exported.");
  }

  function resetExample() {
    setLegs(greeceExampleLegs);
    setTravelers(greeceExampleTravelers);
    setPassSettings(defaultPassSettings);
    setExpandedPassId("interrail");
    setActiveTab("overview");
    setStatusMessage("Greece example restored.");
  }

  return (
    <main className="app-shell min-h-screen overflow-hidden text-foreground transition-colors duration-300">
      <HeroSection
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        routeStops={routeStops}
        bestOptionName={bestOption.name}
        savings={estimatedSaving}
        recommendedTotal={bestOption.total}
        individualTotal={individualTotal}
        copySummary={copySummary}
        exportItineraryJson={exportItineraryJson}
        resetExample={resetExample}
        statusMessage={statusMessage}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <TripOverview routeStops={routeStops} />
        <SavingsMeter
          individualTotal={individualTotal}
          bestTotal={bestOption.total}
          savings={estimatedSaving}
          bestLabel={bestOption.usesIndividualTotal ? "No pass" : "Best pass"}
        />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            items={[
              { value: "overview", label: "Plan" },
              { value: "comparison", label: "Compare" },
              { value: "details", label: "Export" }
            ]}
          />
          <Button
            variant="outline"
            onClick={() => setJsonDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <FileJson className="h-4 w-4" />
            Preview itinerary JSON
          </Button>
        </div>

        {activeTab === "overview" ? (
          <motion.div
            className="grid gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ItineraryTimeline
              pricedLegs={pricedLegs}
              addLeg={addLeg}
              removeLeg={removeLeg}
              updateLeg={updateLeg}
            />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <TravelerCards
                travelers={travelersWithCategory}
                addTraveler={addTraveler}
                removeTraveler={removeTraveler}
                updateTraveler={updateTraveler}
              />
              <div className="grid gap-8">
                <ConfidenceNotes />
                <UsefulLinks />
                <ValidationPanel
                  invalidLegs={invalidLegs}
                  travelerIssues={travelerIssues}
                  travelerCount={travelersWithCategory.length}
                  legCount={pricedLegs.length}
                />
              </div>
            </div>
            <WorkflowNudge
              routeCount={routeStops.length}
              travelerCount={travelersWithCategory.length}
              missingPrices={invalidLegs.length}
              travelerIssues={travelerIssues.length}
              onCompare={() => setActiveTab("comparison")}
            />
          </motion.div>
        ) : null}

        {activeTab === "comparison" ? (
          <motion.div
            className="grid gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PassComparison
              passOptions={passOptions}
              bestOptionId={bestOption.id}
              expandedPassId={expandedPassId}
              setExpandedPassId={setExpandedPassId}
              passSettings={passSettings}
              updatePassSetting={updatePassSetting}
            />
            <FareTable pricedLegs={pricedLegs} />
          </motion.div>
        ) : null}

        {activeTab === "details" ? (
          <motion.div
            className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ExportPanel
              copySummary={copySummary}
              exportItineraryJson={exportItineraryJson}
              resetExample={resetExample}
              statusMessage={statusMessage}
            />
            <div className="grid gap-8">
              <UsefulLinks compact />
              <FareTable pricedLegs={pricedLegs} compact />
            </div>
          </motion.div>
        ) : null}
      </div>

      <Dialog
        open={jsonDialogOpen}
        onOpenChange={setJsonDialogOpen}
        title="Itinerary JSON"
        description="Current comparison data for sharing, auditing, or saving."
      >
        <pre className="max-h-[58vh] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-sky-100">
          {itineraryJson}
        </pre>
      </Dialog>
    </main>
  );
}

function HeroSection({
  darkMode,
  setDarkMode,
  routeStops,
  bestOptionName,
  savings,
  recommendedTotal,
  individualTotal,
  copySummary,
  exportItineraryJson,
  resetExample,
  statusMessage
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  routeStops: string[];
  bestOptionName: string;
  savings: number;
  recommendedTotal: number;
  individualTotal: number;
  copySummary: () => void;
  exportItineraryJson: () => void;
  resetExample: () => void;
  statusMessage: string;
}) {
  return (
    <section className="hero-sea relative isolate overflow-hidden bg-aegean-gradient px-4 py-8 text-white transition-colors duration-500 dark:bg-night-sea-gradient sm:px-6 lg:px-8 lg:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0)_48%,rgba(250,243,226,0.18))] transition-opacity duration-500 dark:opacity-0" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_44%,rgba(3,18,37,0.42))]" />
      <div className="sea-contours absolute inset-0 opacity-45 mix-blend-soft-light" />
      <div className="sunset-ridge absolute inset-x-0 bottom-0 h-28 opacity-80" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Badge className="w-fit bg-white/20 text-white ring-white/30 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            PassPilot
          </Badge>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ModernSwitch
              checked={darkMode}
              onChange={setDarkMode}
              label="Night sea"
              icon={
                darkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              }
              light
            />
            <Button
              variant="outline"
              onClick={copySummary}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
              Copy comparison summary
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-end">
          <div className="max-w-3xl">
            <motion.h1
              className="brand-wordmark text-6xl font-normal leading-tight tracking-normal sm:text-7xl lg:text-8xl"
              style={{ fontFamily: '"Sail", Georgia, Cambria, serif' }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              PassPilot
            </motion.h1>
            <motion.p
              className="mt-5 max-w-2xl text-lg leading-8 text-sky-50/90 sm:text-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              Compare island ferry tickets, Interrail passes, and custom travel
              passes in seconds.
            </motion.p>
            <HeroRoutePreview routeStops={routeStops} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="coral" onClick={exportItineraryJson}>
                <FileJson className="h-4 w-4" />
                Export itinerary JSON
              </Button>
              <Button
                variant="outline"
                onClick={resetExample}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Greece example
              </Button>
            </div>
            {statusMessage ? (
              <motion.p
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white ring-1 ring-white/25 backdrop-blur"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {statusMessage}
              </motion.p>
            ) : null}
          </div>

          <ResultSummary
            routeStops={routeStops}
            bestOptionName={bestOptionName}
            savings={savings}
            recommendedTotal={recommendedTotal}
            individualTotal={individualTotal}
          />
        </div>
      </div>
    </section>
  );
}

function HeroRoutePreview({ routeStops }: { routeStops: string[] }) {
  return (
    <motion.div
      className="mt-7 max-w-2xl rounded-2xl border border-white/25 bg-white/14 p-3 shadow-navy backdrop-blur-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.14 }}
    >
      <div className="flex items-center gap-2 text-xs font-black uppercase text-sky-50/80">
        <Ship className="h-4 w-4" />
        Route in progress
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(routeStops.length ? routeStops : ["Start port", "Island", "Destination"])
          .slice(0, 5)
          .map((stop, index, stops) => (
            <div key={`${stop}-${index}`} className="contents">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-black text-primary shadow-sm">
                {stop}
              </span>
              {index < stops.length - 1 ? (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-gradient text-white shadow-coral">
                  <Ship className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          ))}
      </div>
    </motion.div>
  );
}

function ResultSummary({
  routeStops,
  bestOptionName,
  savings,
  recommendedTotal,
  individualTotal
}: {
  routeStops: string[];
  bestOptionName: string;
  savings: number;
  recommendedTotal: number;
  individualTotal: number;
}) {
  return (
    <motion.div
      className="overflow-hidden rounded-2xl border border-white/30 bg-white/20 shadow-navy backdrop-blur-xl"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.16 }}
    >
      <div className="bg-white/10 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20">
            <BadgePercent className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-sky-50/80">
              Best option
            </p>
            <h2 className="mt-1 text-xl font-bold leading-snug">
              {bestOptionName}
            </h2>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-950/20 p-4 ring-1 ring-white/15">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-sky-50/72">
            <MapPin className="h-3.5 w-3.5" />
            Current route
          </div>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">
            {routeStops.length ? routeStops.join(" -> ") : "Add your ferry route"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 pt-0 sm:grid-cols-3 sm:p-6 sm:pt-0">
        <Metric
          label="Estimated saving"
          value={<AnimatedCurrency value={savings} />}
        />
        <Metric label="Recommended total" value={formatCurrency(recommendedTotal)} />
        <Metric label="Individual tickets" value={formatCurrency(individualTotal)} />
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
      <p className="text-xs font-semibold uppercase text-sky-50/70">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-normal">{value}</p>
    </div>
  );
}

function AnimatedCurrency({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 18 });
  const rounded = useTransform(spring, (latest) => formatCurrency(latest));

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
}

function TripOverview({ routeStops }: { routeStops: string[] }) {
  return (
    <Card className="overflow-hidden border-sky-200/70 bg-card/90 shadow-glow transition hover:-translate-y-0.5 hover:shadow-coral dark:border-sky-900/70">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Route className="h-5 w-5 text-primary" />
              Trip overview
            </CardTitle>
            <CardDescription>
              {routeStops.length ? routeStops.join(" -> ") : "Add ferry legs to begin."}
            </CardDescription>
          </div>
          <Badge variant="outline">{routeStops.length} ports</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {routeStops.length ? (
          <div className="route-map-surface flex flex-col gap-4 rounded-2xl p-4 sm:p-5 lg:flex-row lg:items-center">
            {routeStops.map((stop, index) => (
              <div
                key={`${stop}-${index}`}
                className="flex flex-1 items-center gap-4 lg:contents"
              >
                <div className="min-w-0 flex-1 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 lg:min-w-[10rem]">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Stop {index + 1}
                  </p>
                  <p className="mt-1 truncate text-base font-bold">{stop}</p>
                </div>
                {index < routeStops.length - 1 ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm lg:h-10 lg:w-10">
                    <Ship className="h-5 w-5" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Route className="h-5 w-5" />}>
            Add a ferry leg to build your route map.
          </EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

function SavingsMeter({
  individualTotal,
  bestTotal,
  savings,
  bestLabel
}: {
  individualTotal: number;
  bestTotal: number;
  savings: number;
  bestLabel: string;
}) {
  const max = Math.max(individualTotal, bestTotal, 1);
  const individualWidth = `${Math.max(12, (individualTotal / max) * 100)}%`;
  const bestWidth = `${Math.max(12, (bestTotal / max) * 100)}%`;

  return (
    <Card className="overflow-hidden border-coral-200/70 shadow-glow dark:border-coral-900/40">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Gauge className="h-5 w-5 text-primary" />
              Savings meter
            </CardTitle>
            <CardDescription>
              Individual tickets on one side, the recommendation on the other.
            </CardDescription>
          </div>
          <Badge variant={savings > 0 ? "covered" : "outline"}>
            Difference {formatCurrency(savings)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <MeterBar
            label="Individual tickets"
            value={formatCurrency(individualTotal)}
            width={individualWidth}
            tone="bg-sky-500"
          />
          <div className="grid place-items-center rounded-2xl bg-coral-100 px-5 py-4 text-center text-coral-900 dark:bg-coral-500/15 dark:text-coral-100">
            <span className="text-xs font-bold uppercase">You save</span>
            <span className="text-3xl font-black">
              <AnimatedCurrency value={savings} />
            </span>
          </div>
          <MeterBar
            label={bestLabel}
            value={formatCurrency(bestTotal)}
            width={bestWidth}
            tone="bg-coral-gradient"
            alignRight
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MeterBar({
  label,
  value,
  width,
  tone,
  alignRight
}: {
  label: string;
  value: string;
  width: string;
  tone: string;
  alignRight?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", tone, alignRight && "ml-auto")}
          initial={{ width: "18%" }}
          animate={{ width }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ItineraryTimeline({
  pricedLegs,
  addLeg,
  removeLeg,
  updateLeg
}: {
  pricedLegs: PricedLeg[];
  addLeg: () => void;
  removeLeg: (id: string) => void;
  updateLeg: <K extends keyof FerryLeg>(
    id: string,
    key: K,
    value: FerryLeg[K]
  ) => void;
}) {
  return (
    <Card className="overflow-visible">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-primary" />
              1. Plan your route
            </CardTitle>
            <CardDescription>
              Add ferry legs, pick dates, and use average prices or your own.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge variant="outline">{pricedLegs.length} ferry legs</Badge>
            <Button onClick={addLeg}>
              <Plus className="h-4 w-4" />
              Add ferry leg
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pricedLegs.length ? (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {pricedLegs.map((leg, index) => {
              return (
                <div
                  key={leg.id}
                  className="relative"
                >
                  <motion.article
                    className="group relative flex min-h-[22rem] flex-col overflow-visible rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white via-card to-sky-50/80 p-5 shadow-[0_18px_50px_rgba(0,75,122,0.10)] transition duration-200 hover:-translate-y-1 hover:shadow-glow dark:border-sky-900/60 dark:from-slate-900 dark:via-card dark:to-cyan-950/35"
                    whileHover={{ y: -4 }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-300 to-coral-400" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Ship className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={leg.passCovered ? "covered" : "warning"}>
                          {leg.passCovered ? "Covered" : "Not covered"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLeg(leg.id)}
                          aria-label={`Remove leg ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="From port">
                          <PortInput
                            value={leg.from}
                            onChange={(value) => updateLeg(leg.id, "from", value)}
                            aria-label={`Leg ${index + 1} from port`}
                            placeholder="Athens/Piraeus"
                          />
                        </Field>
                        <Field label="To port">
                          <PortInput
                            value={leg.to}
                            onChange={(value) => updateLeg(leg.id, "to", value)}
                            aria-label={`Leg ${index + 1} to port`}
                            placeholder="Mykonos"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Date">
                          <Input
                            type="date"
                            value={leg.date}
                            onChange={(event) =>
                              updateLeg(leg.id, "date", event.target.value)
                            }
                            aria-label={`Leg ${index + 1} date`}
                          />
                        </Field>
                        <Field label="Ferry company">
                          <OperatorInput
                            value={leg.operator}
                            onChange={(operator, passCovered) => {
                              updateLeg(leg.id, "operator", operator);
                              if (typeof passCovered === "boolean") {
                                updateLeg(leg.id, "passCovered", passCovered);
                              }
                            }}
                            aria-label={`Leg ${index + 1} ferry company`}
                          />
                          <p className="mt-2 text-[11px] font-semibold normal-case leading-4 text-muted-foreground">
                            Choosing a known operator updates likely pass coverage.
                          </p>
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <Field label="Avg price per person">
                          <MoneyInput
                            value={leg.pricePerPerson}
                            onChange={(value) =>
                              updateLeg(
                                leg.id,
                                "pricePerPerson",
                                value
                              )
                            }
                            aria-label={`Leg ${index + 1} average ticket price`}
                          />
                          <PricePresets
                            onSelect={(value) =>
                              updateLeg(leg.id, "pricePerPerson", value)
                            }
                          />
                        </Field>
                        <ModernSwitch
                          checked={leg.passCovered}
                          onChange={(checked) =>
                            updateLeg(leg.id, "passCovered", checked)
                          }
                          label="Pass covered"
                        />
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-white/70 p-3 text-sm ring-1 ring-border/70 dark:bg-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Route</span>
                        <span className="font-semibold">
                          {leg.from || "Start"} to {leg.to || "Destination"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Group fare</span>
                        <span className="font-bold">
                          {leg.perPerson
                            ? formatCurrency(leg.groupPrice)
                            : "Missing"}
                        </span>
                      </div>
                    </div>

                    {!leg.rawPrice.trim() ? (
                      <div className="mt-3">
                        <SoftAlert icon={<AlertTriangle className="h-4 w-4" />}>
                          Add a ticket price to compare this leg.
                        </SoftAlert>
                      </div>
                    ) : null}
                  </motion.article>

                  {index < pricedLegs.length - 1 ? (
                    <div className="pointer-events-none absolute -right-6 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm xl:grid">
                      <Ship className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<Ship className="h-5 w-5" />}>
            Add your first ferry leg to start the comparison.
          </EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

function TravelerCards({
  travelers,
  addTraveler,
  removeTraveler,
  updateTraveler
}: {
  travelers: TravelerWithCategory[];
  addTraveler: () => void;
  removeTraveler: (id: string) => void;
  updateTraveler: <K extends keyof Traveler>(
    id: string,
    key: K,
    value: Traveler[K]
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              2. Add travelers
            </CardTitle>
            <CardDescription>
              Age categories are calculated from the people traveling.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge variant="outline">{travelers.length} travelers</Badge>
            <Button onClick={addTraveler}>
              <UserPlus className="h-4 w-4" />
              Add traveler
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {travelers.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {travelers.map((traveler) => (
              <motion.article
                key={traveler.id}
                className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white via-card to-coral-50/70 p-5 shadow-[0_18px_50px_rgba(0,75,122,0.08)] transition hover:-translate-y-1 hover:shadow-glow dark:border-sky-900/60 dark:from-slate-900 dark:via-card dark:to-cyan-950/25"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid flex-1 gap-3">
                    <Field label="Name">
                      <Input
                        value={traveler.name}
                        onChange={(event) =>
                          updateTraveler(traveler.id, "name", event.target.value)
                        }
                        aria-label={`${traveler.name || "Traveler"} name`}
                      />
                    </Field>
                    <Field label="Age">
                      <Input
                        type="number"
                        value={traveler.age}
                        inputMode="numeric"
                        min="1"
                        max="120"
                        onChange={(event) =>
                          updateTraveler(traveler.id, "age", event.target.value)
                        }
                        aria-label={`${traveler.name || "Traveler"} age`}
                      />
                    </Field>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTraveler(traveler.id)}
                    aria-label={`Remove ${traveler.name || "traveler"}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-border/70 dark:bg-white/10">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      Estimated pass price
                    </p>
                    <p className="mt-1 text-2xl font-black">
                      {formatCurrency(traveler.passPrice)}
                    </p>
                  </div>
                  <Badge
                    variant={traveler.category.toLowerCase() as Lowercase<Category>}
                  >
                    {traveler.category}
                  </Badge>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Users className="h-5 w-5" />}>
            Add at least one traveler to calculate group costs.
          </EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

function PassComparison({
  passOptions,
  bestOptionId,
  expandedPassId,
  setExpandedPassId,
  passSettings,
  updatePassSetting
}: {
  passOptions: PassOption[];
  bestOptionId: string;
  expandedPassId: string | null;
  setExpandedPassId: (id: string | null) => void;
  passSettings: PassSettings;
  updatePassSetting: <K extends keyof PassSettings>(
    key: K,
    value: PassSettings[K]
  ) => void;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <WalletCards className="h-6 w-6 text-primary" />
          Pass comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          The recommendation updates from your route, travelers, and prices.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {passOptions.map((option) => {
          const isBest = option.id === bestOptionId;
          const isExpanded = expandedPassId === option.id;

          return (
            <motion.article
              key={option.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white via-card to-sky-50/80 shadow-[0_18px_55px_rgba(0,75,122,0.10)] transition duration-200 hover:-translate-y-1 hover:shadow-glow dark:from-slate-900 dark:via-card dark:to-cyan-950/30",
                isBest
                  ? "border-coral-300 shadow-coral ring-1 ring-coral-300/60"
                  : "border-border"
              )}
              whileHover={{ y: -5 }}
            >
              <div
                className={cn(
                  "h-1.5",
                  isBest
                    ? "bg-coral-gradient"
                    : "bg-gradient-to-r from-sky-300 to-primary"
                )}
              />
              {isBest ? (
                <div className="absolute right-4 top-4 rounded-full bg-coral-gradient px-3 py-1 text-xs font-black uppercase text-white shadow-coral">
                  Best value
                </div>
              ) : null}
              <div className="p-5">
                <Badge variant={isBest ? "senior" : "outline"}>
                  {option.label}
                </Badge>
                <h3 className="mt-4 min-h-[3.2rem] text-xl font-black leading-tight">
                  {option.name}
                </h3>
                <p className="mt-2 min-h-[3.8rem] text-sm leading-6 text-muted-foreground">
                  {option.description}
                </p>
                <div className="mt-5 rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Total group cost
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {formatCurrency(option.total)}
                  </p>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <DetailRow
                    label="Covered legs"
                    value={
                      option.usesIndividualTotal
                        ? "All tickets"
                        : `${option.coveredLegs} / ${option.totalLegs}`
                    }
                  />
                  <DetailRow
                    label="Savings vs tickets"
                    value={
                      option.savings > 0
                        ? formatCurrency(option.savings)
                        : option.usesIndividualTotal
                          ? "Baseline"
                          : "No saving"
                    }
                  />
                </div>
                <div className="mt-5 space-y-2">
                  {option.warnings.map((warning) => (
                    <SoftAlert
                      key={warning}
                      icon={<AlertTriangle className="h-4 w-4" />}
                    >
                      {warning}
                    </SoftAlert>
                  ))}
                </div>

                {option.editMode ? (
                  <>
                    <Button
                      variant="ghost"
                      className="mt-5 w-full justify-between"
                      onClick={() =>
                        setExpandedPassId(isExpanded ? null : option.id)
                      }
                      aria-expanded={isExpanded}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        Edit pass details
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </Button>
                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          className="mt-4 space-y-4 overflow-hidden rounded-2xl border border-border bg-background/70 p-4"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24 }}
                        >
                          {option.editMode === "interrail" ? (
                            <InterrailPassFields
                              passSettings={passSettings}
                              updatePassSetting={updatePassSetting}
                            />
                          ) : (
                            <CustomPassFields
                              passSettings={passSettings}
                              updatePassSetting={updatePassSetting}
                            />
                          )}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function InterrailPassFields({
  passSettings,
  updatePassSetting
}: {
  passSettings: PassSettings;
  updatePassSetting: <K extends keyof PassSettings>(
    key: K,
    value: PassSettings[K]
  ) => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Youth pass">
          <MoneyInput
            value={passSettings.youthPrice}
            onChange={(value) => updatePassSetting("youthPrice", value)}
            aria-label="Youth pass price"
          />
        </Field>
        <Field label="Adult pass">
          <MoneyInput
            value={passSettings.adultPrice}
            onChange={(value) => updatePassSetting("adultPrice", value)}
            aria-label="Adult pass price"
          />
        </Field>
        <Field label="Senior pass">
          <MoneyInput
            value={passSettings.seniorPrice}
            onChange={(value) => updatePassSetting("seniorPrice", value)}
            aria-label="Senior pass price"
          />
        </Field>
      </div>
      <Field label="Booking or reservation fees">
        <MoneyInput
          value={passSettings.serviceFee}
          onChange={(value) => updatePassSetting("serviceFee", value)}
          aria-label="Booking or reservation fees"
        />
      </Field>
    </>
  );
}

function CustomPassFields({
  passSettings,
  updatePassSetting
}: {
  passSettings: PassSettings;
  updatePassSetting: <K extends keyof PassSettings>(
    key: K,
    value: PassSettings[K]
  ) => void;
}) {
  return (
    <>
      <Field label="Quoted group pass cost">
        <MoneyInput
          value={passSettings.customGroupPrice}
          onChange={(value) => updatePassSetting("customGroupPrice", value)}
          aria-label="Quoted group pass cost"
        />
      </Field>
      <Field label="Extra fees">
        <MoneyInput
          value={passSettings.customServiceFee}
          onChange={(value) => updatePassSetting("customServiceFee", value)}
          aria-label="Custom pass extra fees"
        />
      </Field>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-background/70 px-3 py-2 ring-1 ring-border/70">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function ConfidenceNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Confidence notes
        </CardTitle>
        <CardDescription>Practical caveats before purchasing.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {confidenceNotes.map((note) => (
          <div
            key={note}
            className="flex items-start gap-3 rounded-2xl bg-sky-500/10 p-4 ring-1 ring-sky-500/15"
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm font-medium leading-6">{note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function UsefulLinks({ compact }: { compact?: boolean }) {
  return (
    <Card className="overflow-hidden border-sky-200/70 dark:border-sky-900/60">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ExternalLink className="h-5 w-5 text-primary" />
              Useful links
            </CardTitle>
            <CardDescription>
              Quick checks before you commit to tickets or passes.
            </CardDescription>
          </div>
          <Badge variant="outline">{usefulLinks.length} resources</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "")}>
          {usefulLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-border bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow dark:from-slate-900 dark:to-cyan-950/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline">{link.label}</Badge>
                  <h3 className="mt-3 text-base font-black text-foreground">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowNudge({
  routeCount,
  travelerCount,
  missingPrices,
  travelerIssues,
  onCompare
}: {
  routeCount: number;
  travelerCount: number;
  missingPrices: number;
  travelerIssues: number;
  onCompare: () => void;
}) {
  const ready = routeCount > 1 && travelerCount > 0 && !missingPrices && !travelerIssues;

  return (
    <Card className="overflow-hidden border-sky-200/80 bg-card/95 shadow-glow dark:border-sky-900/60">
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="route-map-surface flex min-h-44 flex-col justify-between gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <Badge variant={ready ? "covered" : "warning"}>
              {ready ? "Ready" : "Needs attention"}
            </Badge>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              {ready ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <WalletCards className="h-5 w-5" />
              )}
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-muted-foreground">
              Next step
            </p>
            <h3 className="mt-2 text-2xl font-black leading-tight">
              {ready ? "Compare your best fare" : "Complete your trip inputs"}
            </h3>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
          <div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {ready
                ? "Everything needed is in place. Compare passes against individual tickets with your current route and prices."
                : "Add the missing details, then compare pass options with cleaner results."}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <StatusTile
                icon={<Route className="h-4 w-4" />}
                label="Route"
                value={`${routeCount} ports`}
                good={routeCount > 1}
              />
              <StatusTile
                icon={<Users className="h-4 w-4" />}
                label="Travelers"
                value={`${travelerCount}`}
                good={travelerCount > 0 && !travelerIssues}
              />
              <StatusTile
                icon={<Euro className="h-4 w-4" />}
                label="Prices"
                value={missingPrices ? `${missingPrices} missing` : "Ready"}
                good={!missingPrices}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Pass vs tickets result is one click away.
            </p>
            <Button
              variant="coral"
              onClick={onCompare}
              className="h-12 w-full px-6 text-base sm:w-auto"
            >
              <BadgePercent className="h-4 w-4" />
              Compare options
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusTile({
  icon,
  label,
  value,
  good
}: {
  icon: ReactNode;
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3",
        good
          ? "border-emerald-500/20 bg-emerald-500/10"
          : "border-amber-500/25 bg-amber-500/12"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-xs font-black uppercase",
          good
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-amber-800 dark:text-amber-200"
        )}
      >
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

function ValidationPanel({
  invalidLegs,
  travelerIssues,
  travelerCount,
  legCount
}: {
  invalidLegs: PricedLeg[];
  travelerIssues: TravelerWithCategory[];
  travelerCount: number;
  legCount: number;
}) {
  const isReady =
    invalidLegs.length === 0 &&
    travelerIssues.length === 0 &&
    travelerCount > 0 &&
    legCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Waves className="h-5 w-5 text-primary" />
          Travel checks
        </CardTitle>
        <CardDescription>
          Missing prices, travelers, and coverage cautions appear here.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {!legCount ? (
          <SoftAlert icon={<AlertTriangle className="h-4 w-4" />} large>
            Add at least one itinerary leg to compare pass vs no pass.
          </SoftAlert>
        ) : null}
        {!travelerCount ? (
          <SoftAlert icon={<AlertTriangle className="h-4 w-4" />} large>
            Add at least one traveler to calculate group costs.
          </SoftAlert>
        ) : null}
        {invalidLegs.map((leg) => (
          <SoftAlert key={leg.id} icon={<AlertTriangle className="h-4 w-4" />} large>
            Add a ticket price to compare {leg.from || "this port"} to{" "}
            {leg.to || "the next port"}.
          </SoftAlert>
        ))}
        {travelerIssues.map((traveler) => (
          <SoftAlert
            key={traveler.id}
            icon={<AlertTriangle className="h-4 w-4" />}
            large
          >
            Add a name and age for every traveler.
          </SoftAlert>
        ))}
        <SoftAlert icon={<AlertTriangle className="h-4 w-4" />} large>
          This operator may not be covered by this pass.
        </SoftAlert>
        {isReady ? (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-800 ring-1 ring-emerald-500/20 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">
              The comparison is using your itinerary, travelers, and current
              price assumptions.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function FareTable({
  pricedLegs,
  compact
}: {
  pricedLegs: PricedLeg[];
  compact?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Ticket className="h-5 w-5 text-primary" />
              Fare assumptions
            </CardTitle>
            <CardDescription>
              Desktop table with stacked mobile cards.
            </CardDescription>
          </div>
          <Badge variant="outline">Sticky header</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {pricedLegs.length ? (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
              <div
                className={cn(
                  "overflow-auto",
                  compact ? "max-h-[32rem]" : "max-h-[26rem]"
                )}
              >
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-primary text-primary-foreground">
                    <tr>
                      <th className="px-4 py-3 font-bold">Route</th>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Company</th>
                      <th className="px-4 py-3 font-bold">Per person</th>
                      <th className="px-4 py-3 font-bold">Group fare</th>
                      <th className="px-4 py-3 font-bold">Pass status</th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr:nth-child(even)]:bg-muted/50">
                    {pricedLegs.map((leg) => (
                      <tr key={leg.id} className="border-t border-border">
                        <td className="px-4 py-4 font-semibold">
                          {leg.from} to {leg.to}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(leg.date)}
                        </td>
                        <td className="px-4 py-4">{leg.operator || "TBC"}</td>
                        <td className="px-4 py-4 font-bold">
                          {leg.perPerson ? formatCurrency(leg.perPerson) : "Missing"}
                        </td>
                        <td className="px-4 py-4 font-bold">
                          {leg.perPerson ? formatCurrency(leg.groupPrice) : "Missing"}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={leg.passCovered ? "covered" : "warning"}>
                            {leg.passCovered ? "Covered" : "Not covered"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-3 md:hidden">
              {pricedLegs.map((leg) => (
                <div
                  key={leg.id}
                  className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">
                        {leg.from} to {leg.to}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(leg.date)} · {leg.operator || "TBC"}
                      </p>
                    </div>
                    <Badge variant={leg.passCovered ? "covered" : "warning"}>
                      {leg.passCovered ? "Covered" : "Not covered"}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 rounded-xl bg-background/80 p-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Per person</span>
                      <span className="font-bold">
                        {leg.perPerson ? formatCurrency(leg.perPerson) : "Missing"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Group fare</span>
                      <span className="font-bold">
                        {leg.perPerson ? formatCurrency(leg.groupPrice) : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon={<Ticket className="h-5 w-5" />}>
            Fare rows appear after you add itinerary legs.
          </EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

function ExportPanel({
  copySummary,
  exportItineraryJson,
  resetExample,
  statusMessage
}: {
  copySummary: () => void;
  exportItineraryJson: () => void;
  resetExample: () => void;
  statusMessage: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileJson className="h-5 w-5 text-primary" />
          Export and share
        </CardTitle>
        <CardDescription>Copy, export, or restore the Greece example.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button onClick={copySummary} className="justify-start">
          <Copy className="h-4 w-4" />
          Copy comparison summary
        </Button>
        <Button variant="coral" onClick={exportItineraryJson} className="justify-start">
          <FileJson className="h-4 w-4" />
          Export itinerary JSON
        </Button>
        <Button variant="outline" onClick={resetExample} className="justify-start">
          <RotateCcw className="h-4 w-4" />
          Reset to Greece example
        </Button>
        {statusMessage ? (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-500/20 dark:text-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
            {statusMessage}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MoneyInput({
  value,
  onChange,
  "aria-label": ariaLabel
}: {
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
}) {
  return (
    <div className="relative">
      <Euro className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="number"
        min="0"
        step="1"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="pl-9"
      />
    </div>
  );
}

function PricePresets({ onSelect }: { onSelect: (value: string) => void }) {
  const presets = [
    { label: "Short", value: "35" },
    { label: "Typical", value: "55" },
    { label: "Fast ferry", value: "85" }
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/15 transition hover:bg-primary hover:text-primary-foreground"
          onClick={() => onSelect(preset.value)}
        >
          {preset.label} {formatCurrency(Number(preset.value))}
        </button>
      ))}
    </div>
  );
}

function PortInput({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "aria-label": string;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    const matches = portSuggestions.filter((port) =>
      port.toLowerCase().includes(query)
    );

    return (query && matches.length ? matches : portSuggestions).slice(0, 7);
  }, [value]);

  return (
    <div className="relative z-30">
      <Input
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={ariaLabel}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
      />
      <AnimatePresence>
        {open && suggestions.length ? (
          <motion.div
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-64 overflow-auto rounded-2xl border border-border bg-card p-1.5 shadow-navy"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="listbox"
          >
            {suggestions.map((port) => (
              <button
                key={port}
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(port);
                  setOpen(false);
                }}
                role="option"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{port}</span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function OperatorInput({
  value,
  onChange,
  "aria-label": ariaLabel
}: {
  value: string;
  onChange: (value: string, passCovered?: boolean) => void;
  "aria-label": string;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    const matches = operatorSuggestions.filter((operator) =>
      operator.name.toLowerCase().includes(query)
    );

    return (query && matches.length ? matches : operatorSuggestions).slice(0, 7);
  }, [value]);

  const knownOperator = operatorSuggestions.find(
    (operator) => operator.name.toLowerCase() === value.trim().toLowerCase()
  );

  return (
    <div className="relative z-20">
      <Input
        value={value}
        placeholder="Choose operator"
        autoComplete="off"
        aria-label={ariaLabel}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
      />
      {knownOperator ? (
        <Badge
          className="mt-2"
          variant={knownOperator.passCovered ? "covered" : "warning"}
        >
          {knownOperator.passCovered
            ? "Usually pass-covered"
            : "Usually not pass-covered"}
        </Badge>
      ) : null}
      <AnimatePresence>
        {open && suggestions.length ? (
          <motion.div
            className="absolute left-0 top-[calc(100%+0.35rem)] z-50 max-h-80 w-[min(24rem,calc(100vw-2rem))] overflow-auto rounded-2xl border border-border bg-card p-2 shadow-navy"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="listbox"
          >
            {suggestions.map((operator) => (
              <button
                key={operator.name}
                type="button"
                className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm text-foreground transition hover:bg-muted"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(operator.name, operator.passCovered);
                  setOpen(false);
                }}
                role="option"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Ship className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block whitespace-normal break-words font-black leading-5">
                    {operator.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset",
                      operator.passCovered
                        ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
                        : "bg-amber-500/15 text-amber-800 ring-amber-500/25 dark:text-amber-200"
                    )}
                  >
                    {operator.passCovered
                      ? "Usually pass-covered"
                      : "Usually not pass-covered"}
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase text-muted-foreground">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function EmptyState({
  icon,
  children
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm font-semibold text-muted-foreground">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background text-primary shadow-sm">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function SoftAlert({
  children,
  icon,
  large
}: {
  children: ReactNode;
  icon: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl bg-amber-500/10 text-amber-900 ring-1 ring-amber-500/20 dark:text-amber-100",
        large ? "p-4 text-sm" : "px-3 py-2 text-xs"
      )}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="font-semibold leading-5">{children}</span>
    </div>
  );
}

function ModernSwitch({
  checked,
  onChange,
  label,
  icon,
  light
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon?: ReactNode;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4",
        light
          ? "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/20 focus-visible:ring-white/30"
          : "bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-primary/20"
      )}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked
            ? "bg-coral-gradient"
            : light
              ? "bg-white/25"
              : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
            checked ? "left-6" : "left-1"
          )}
        />
      </span>
    </button>
  );
}

function getRouteStops(legs: FerryLeg[]) {
  if (!legs.length) {
    return [];
  }

  const firstStop = legs[0].from.trim() || "Start port";
  return [
    firstStop,
    ...legs.map((leg, index) => leg.to.trim() || `Stop ${index + 2}`)
  ];
}

function getCategory(age: number): Category {
  if (age > 0 && age <= 27) {
    return "Youth";
  }

  if (age >= 60) {
    return "Senior";
  }

  return "Adult";
}

function parseAge(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function parsePrice(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(Math.max(0, Math.round(value)));
}

function formatDate(value: string) {
  if (!value) {
    return "TBC";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short"
  }).format(date);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default App;

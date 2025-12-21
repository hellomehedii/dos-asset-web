import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Linkedin, Twitter } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  image: string | null;
  is_active: boolean | null;
  display_order: number | null;
  team_category: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
};

const SocialLinks = ({ member }: { member: TeamMember }) => (
  <div className="flex items-center justify-center gap-2 mt-4">
    {member.social_facebook && (
      <a
        href={member.social_facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        aria-label={`${member.name} on Facebook`}
      >
        <Facebook className="h-4 w-4" />
      </a>
    )}
    {member.social_linkedin && (
      <a
        href={member.social_linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        aria-label={`${member.name} on LinkedIn`}
      >
        <Linkedin className="h-4 w-4" />
      </a>
    )}
    {member.social_twitter && (
      <a
        href={member.social_twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        aria-label={`${member.name} on Twitter`}
      >
        <Twitter className="h-4 w-4" />
      </a>
    )}
  </div>
);

const MemberCard = ({ member }: { member: TeamMember }) => {
  const initials = (member.name || "").trim().slice(0, 1).toUpperCase();

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square bg-secondary">
        {member.image ? (
          <img
            src={member.image}
            alt={`${member.name} - ${member.designation}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-background/70 ring-1 ring-border flex items-center justify-center">
              <span className="text-2xl font-serif font-semibold text-foreground">{initials}</span>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />
      </div>

      <div className="p-5 text-center">
        <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-primary">{member.designation}</p>
        <SocialLinks member={member} />
      </div>
    </article>
  );
};

const TeamSection = ({
  eyebrow,
  title,
  description,
  members,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  members: TeamMember[];
  tone?: "default" | "muted";
}) => {
  if (members.length === 0) return null;

  return (
    <section className={tone === "muted" ? "section-padding bg-secondary" : "section-padding"}>
      <div className="container-custom">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wider uppercase text-primary">{eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-3 text-muted-foreground">{description}</p>
          )}
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Management = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("management_team")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return (data || []) as TeamMember[];
    },
  });

  const boardMembers = teamMembers?.filter((m) => m.team_category === "board") || [];
  const seniorManagement =
    teamMembers?.filter((m) => m.team_category === "senior_management") || [];
  const team =
    teamMembers?.filter((m) => m.team_category === "team" || !m.team_category) || [];

  return (
    <>
      <Helmet>
        <title>Management Team | Horizon</title>
        <meta
          name="description"
          content="Meet Horizon's management team: board of directors, senior leaders, and team members driving real estate excellence."
        />
        <link rel="canonical" href="/about/management" />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="container-custom relative py-16 md:py-20">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Management Team
            </h1>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl">
              The people behind our projects—focused on quality, delivery, and long-term trust.
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="section-padding">
            <div className="container-custom text-center text-muted-foreground">
              Loading team...
            </div>
          </section>
        ) : (
          <>
            <TeamSection
              eyebrow="Leadership"
              title="Board of Directors"
              description="Strategic guidance and governance for long-term growth."
              members={boardMembers}
            />

            <TeamSection
              eyebrow="Operations"
              title="Senior Management"
              description="Experienced leaders who execute with speed and precision."
              members={seniorManagement}
              tone="muted"
            />

            <TeamSection
              eyebrow="People"
              title="The Team"
              description="A dedicated group delivering great homes and better experiences."
              members={team}
            />

            <section className="pb-16">
              <div className="container-custom">
                <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    Our team brings together decades of real estate development, construction, and customer service experience—built on transparency and results.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Management;


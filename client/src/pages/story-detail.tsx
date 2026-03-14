import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, Tag, User, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StoryInsight = {
  challenge: string;
  solution: string;
  practicalSteps: string[];
};

const insightsByCategory: Record<string, StoryInsight> = {
  Heritage: {
    challenge:
      "Traditional knowledge can fade quickly when younger generations do not see a sustainable future in craft.",
    solution:
      "Document techniques in plain language, include family stories in the process, and create paid learning pathways so preservation is practical, not only emotional.",
    practicalSteps: [
      "Record one process per week with photos and short notes.",
      "Pair one senior artisan with one learner for monthly mentorship.",
      "Attach story tags to products so buyers understand cultural value.",
    ],
  },
  Interview: {
    challenge:
      "Many artisans know their craft deeply but struggle to communicate pricing, process, and value online.",
    solution:
      "Use transparent storytelling: explain materials, labor time, and decision-making so buyers connect with the person behind the product.",
    practicalSteps: [
      "Publish one behind-the-scenes post each week.",
      "Break pricing into material, labor, and design effort.",
      "Create a consistent schedule for making, packing, and communication.",
    ],
  },
  Techniques: {
    challenge:
      "Inconsistent outcomes happen when tacit techniques stay only in memory and are not repeatable.",
    solution:
      "Turn craft methods into repeatable checklists and test in small batches before scaling production.",
    practicalSteps: [
      "Write a step-by-step checklist after each successful piece.",
      "Track one variable at a time (heat, tension, or finish).",
      "Run quick small tests before full production runs.",
    ],
  },
  Events: {
    challenge:
      "Community engagement often drops when events focus only on selling and not on participation.",
    solution:
      "Design events around hands-on learning, repair culture, and dialogue so visitors become long-term supporters.",
    practicalSteps: [
      "Offer a 15-minute interactive demo in every event slot.",
      "Collect participant questions and publish follow-up answers.",
      "Include repair and care guidance with each purchase.",
    ],
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StoryDetail() {
  const [, params] = useRoute("/community/stories/:id");
  const storyId = params?.id || "";

  const { data: story, isLoading } = useQuery({
    queryKey: ["/api/stories", storyId],
    queryFn: () => api.getStory(storyId),
    enabled: !!storyId,
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: () => api.getArtisans(),
  });

  const authorName = useMemo(() => {
    if (!story?.authorId) return "Community Team";
    return artisans?.find((a: any) => a.id === story.authorId)?.name || "Unknown Author";
  }, [artisans, story]);

  const insight = useMemo(() => {
    if (!story?.category) return null;
    return insightsByCategory[story.category] || null;
  }, [story]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-72 w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/2 mb-10" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (!story) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Story not found</h1>
          <p className="text-muted-foreground mb-6">This story may have been removed or the link is incorrect.</p>
          <Link href="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Link href="/community">
          <Button variant="ghost" className="mb-6 text-foreground hover:text-primary" data-testid="button-back-to-community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stories
          </Button>
        </Link>

        <article className="space-y-8 animate-fade-in-scale" data-testid={`story-detail-${story.id}`}>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            <img src={story.coverImage} alt={story.title} className="w-full h-[320px] sm:h-[420px] object-cover" />
          </div>

          <header className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Badge className="bg-accent/20 text-accent">
                <Tag className="h-3 w-3 mr-1" />
                {story.category}
              </Badge>
              <span className="text-sm text-muted-foreground inline-flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(story.publishDate)}
              </span>
              <span className="text-sm text-muted-foreground inline-flex items-center">
                <User className="h-4 w-4 mr-1" />
                by {authorName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight text-foreground">{story.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{story.excerpt}</p>
          </header>

          <Card className="border border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">The Human Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg leading-8 text-foreground/90">{story.content}</p>
            </CardContent>
          </Card>

          {insight && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-border shadow-md hover:shadow-lg smooth-transition">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Real Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-7">{insight.challenge}</p>
                </CardContent>
              </Card>

              <Card className="border border-border shadow-md hover:shadow-lg smooth-transition">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-secondary" />
                    Clear Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-7">{insight.solution}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {insight && (
            <Card className="border border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                  Practical Steps You Can Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insight.practicalSteps.map((step, index) => (
                    <li key={index} className="flex items-start text-muted-foreground">
                      <span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary" />
                      <span className="leading-7">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </section>
  );
}

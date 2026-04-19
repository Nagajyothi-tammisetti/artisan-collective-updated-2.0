import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Product } from "@shared/schema";

export default function Wishlist() {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Load liked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("likedProducts");
    if (saved) {
      try {
        setLikedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => api.getProducts(),
    refetchInterval: 5000, // Poll every 5s for real-time likes
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: api.getArtisans,
  });

  // Filter products to show only liked ones
  const wishlistItems = products?.filter(p => likedIds.includes(p.id)) || [];

  const getArtisanName = (artisanId: string) => {
    const artisan = artisans?.find((a: any) => a.id === artisanId);
    return artisan?.name || "Artisan";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="mb-6 hover:translate-x-1 smooth-transition">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-foreground">My Wishlist</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A personal collection of your favorite handcrafted treasures.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-primary/10 shadow-sm">
              <span className="text-2xl font-bold text-primary">{wishlistItems.length}</span>
              <span className="text-muted-foreground font-medium">Items Saved</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {productsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <Heart className="h-24 w-24 text-muted-foreground/30 relative" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Explore the marketplace and click the heart icon to save items you love here for later.
            </p>
            <Link href="/marketplace">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:scale-110 smooth-transition">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Go Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500">
            {wishlistItems.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                artisanName={getArtisanName(product.artisanId)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

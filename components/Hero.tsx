import { createClient } from "@/lib/supabase/server";
import HeroSlider from "./HeroSlider";

export default async function Hero() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("hero_slides")
        .select(
            `
            id,
            image_url,
            tagline,
            title,
            description,
            sort_order
            `
        )
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Gagal mengambil hero slides:", error);
    }

    return <HeroSlider slides={data ?? []} />;
}
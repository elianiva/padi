export type Course = {
    title: string;
    slug: string;
    background: string; // tailwind colour
}

export const courses: Course[] = [
    {
        title: "Statistik Komputasi",
        slug: "statistik-komputasi",
        background: "bg-sky-500"
    },
    {
        title: "Sistem Pendukung Keputusan",
        slug: "sistem-pendukung-keputusan",
        background: "bg-rose-500",
    },
    {
        title: "Proyek Sistem Informasi",
        slug: "proyek-sistem-informasi",
        background: "bg-violet-500",
    },
    {
        title: "Praktikum Jaringan Komputer",
        slug: "praktikum-jaringan-komputer",
        background: "bg-amber-500",
    },
    {
        title: "Pemrograman Web Lanjut",
        slug: "pemrograman-web-lanjut",
        background: "bg-cyan-500",
    },
    {
        title: "Jaringan Komputer",
        slug: "jaringan-komputer",
        background: "bg-green-500",
    },
    {
        title: "Business Intelligence",
        slug: "business-intelligence",
        background: "bg-blue-500",
    },
    {
        title: "Bahasa Indonesia",
        slug: "bahasa-indonesia",
        background: "bg-indigo-500",
    },
    {
        title: "Analisis dan Desain Berorientasi Objek",
        slug: "analisis-dan-desain-berorientasi-objek",
        background: "bg-red-500",
    }
];
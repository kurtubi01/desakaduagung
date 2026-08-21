"use client";

import Image from "next/image";

interface LoadingScreenProps {
  exiting: boolean;
}

export default function LoadingScreen({ exiting }: LoadingScreenProps) {
  return (
    <div className={`loading-screen ${exiting ? "loading-screen--exit" : ""}`} role="status" aria-label="Memuat website Desa Kadu Agung">
      <div className="loading-orbit" aria-hidden="true">
        <span className="loading-ring loading-ring--outer" />
        <span className="loading-ring loading-ring--inner" />
        <span className="loading-orbit-dot loading-orbit-dot--one" />
        <span className="loading-orbit-dot loading-orbit-dot--two" />
        <span className="loading-orbit-dot loading-orbit-dot--three" />
        <div className="loading-logo">
          <Image
            src="/Logo_kabupaten_serang.png"
            alt="Lambang Kabupaten Serang"
            width={180}
            height={220}
          />
        </div>
      </div>
      <div className="loading-copy">
        <p className="loading-title">Desa Kadu Agung</p>
        <p className="loading-location">Kec. Gunungsari <span aria-hidden="true">•</span> Kab. Serang</p>
        <p className="loading-status"><span />Memuat Desa...</p>
      </div>
    </div>
  );
}
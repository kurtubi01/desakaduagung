'use client'

import { useState } from 'react'

import {
    FaFacebookF,
    FaWhatsapp,
    FaXTwitter,
    FaLink,
} from 'react-icons/fa6'

import {
    SiTelegram,
} from 'react-icons/si'

import {
    FaShareAlt,
} from 'react-icons/fa'

interface ShareBeritaProps {
    title: string
}

export default function ShareBerita({
    title,
}: ShareBeritaProps) {
    const [copied, setCopied] = useState(false)

    const getUrl = () => {
        if (typeof window === 'undefined') {
            return ''
        }

        return window.location.href
    }

    const shareWhatsApp = () => {
        const text = `${title}\n\n${getUrl()}`

        const url =
            `https://wa.me/?text=${encodeURIComponent(text)}`

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        )
    }

    const shareFacebook = () => {
        const url =
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                getUrl()
            )}`

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        )
    }

    const shareTelegram = () => {
        const url =
            `https://t.me/share/url?url=${encodeURIComponent(
                getUrl()
            )}&text=${encodeURIComponent(title)}`

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        )
    }

    const shareX = () => {
        const url =
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
            )}&url=${encodeURIComponent(
                getUrl()
            )}`

        window.open(
            url,
            '_blank',
            'noopener,noreferrer'
        )
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                getUrl()
            )

            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error(
                'Gagal menyalin link:',
                error
            )
        }
    }

    return (
        <div>

            {/* Header */}

            <div className="border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center bg-emerald-50 text-emerald-600">
                        <FaShareAlt size={17} />
                    </div>

                    <div>

                        <p className="text-sm font-bold text-slate-900">
                            Bagikan Informasi
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Sebarkan berita desa
                        </p>

                    </div>

                </div>

            </div>


            {/* Content */}

            <div className="px-5 py-5">

                <p className="text-sm leading-6 text-slate-500">
                    Bagikan berita ini kepada
                    keluarga, tetangga, dan
                    masyarakat agar informasi
                    desa dapat diketahui lebih luas.
                </p>


                {/* Social Media */}

                <div className="mt-5 grid grid-cols-4 gap-2">

                    {/* WhatsApp */}

                    <button
                        type="button"
                        onClick={shareWhatsApp}
                        aria-label="Bagikan ke WhatsApp"
                        title="WhatsApp"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:border-green-500
                            hover:bg-green-50
                            hover:text-green-600
                        "
                    >
                        <FaWhatsapp size={19} />
                    </button>


                    {/* Facebook */}

                    <button
                        type="button"
                        onClick={shareFacebook}
                        aria-label="Bagikan ke Facebook"
                        title="Facebook"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:border-blue-500
                            hover:bg-blue-50
                            hover:text-blue-600
                        "
                    >
                        <FaFacebookF size={17} />
                    </button>


                    {/* Telegram */}

                    <button
                        type="button"
                        onClick={shareTelegram}
                        aria-label="Bagikan ke Telegram"
                        title="Telegram"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:border-sky-500
                            hover:bg-sky-50
                            hover:text-sky-600
                        "
                    >
                        <SiTelegram size={18} />
                    </button>


                    {/* X */}

                    <button
                        type="button"
                        onClick={shareX}
                        aria-label="Bagikan ke X"
                        title="X"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:border-slate-900
                            hover:bg-slate-100
                            hover:text-slate-900
                        "
                    >
                        <FaXTwitter size={17} />
                    </button>

                </div>


                {/* Copy Link */}

                <button
                    type="button"
                    onClick={copyLink}
                    className="
                        mt-3
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-slate-600
                        transition
                        hover:border-emerald-500
                        hover:bg-emerald-50
                        hover:text-emerald-700
                    "
                >

                    {copied ? (
                        <>
                            <span className="text-emerald-600">
                                ✓
                            </span>

                            Link berhasil disalin
                        </>
                    ) : (
                        <>
                            <FaLink size={14} />

                            Salin Link Berita
                        </>
                    )}

                </button>

            </div>

        </div>
    )
}
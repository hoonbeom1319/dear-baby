import type { SVGProps } from 'react';

/**
 * hb-kit iconography contract: Lucide / Feather style, 24×24 viewBox,
 * stroke 1.75, round caps and joins, no fill. Drawn as inline SVG literals
 * (the system ships no icon font). Star/nav use fills where the glyph needs it.
 */
export type IconName =
    | 'back'
    | 'close'
    | 'star'
    | 'star-fill'
    | 'share'
    | 'phone'
    | 'copy'
    | 'nav'
    | 'right'
    | 'down'
    | 'down-arrow'
    | 'check'
    | 'x'
    | 'thumb'
    | 'thumb-down'
    | 'pin'
    | 'clock'
    | 'image'
    | 'info'
    | 'baby'
    | 'map'
    | 'more'
    | 'alert'
    | 'heart'
    | 'home'
    | 'route'
    | 'inbox'
    | 'settings'
    | 'plus'
    | 'edit'
    | 'trash'
    | 'search'
    | 'up-arrow'
    | 'bell'
    | 'user'
    | 'amen-nurse'
    | 'amen-diaper'
    | 'amen-chair'
    | 'amen-stroll'
    | 'amen-park';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'stroke'> & {
    name: IconName;
    size?: number;
    /** Stroke width (maps to SVG stroke-width). Color comes from `currentColor`. */
    stroke?: number;
};

export const Icon = ({ name, size = 20, stroke = 1.75, ...props }: IconProps) => {
    const common: SVGProps<SVGSVGElement> = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: stroke,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        ...props
    };

    switch (name) {
        case 'back':
            return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
        case 'close':
        case 'x':
            return <svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>;
        case 'star':
            return (
                <svg {...common}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            );
        case 'star-fill':
            return (
                <svg {...common} fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            );
        case 'share':
            return (
                <svg {...common}>
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            );
        case 'phone':
            return (
                <svg {...common}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
                </svg>
            );
        case 'copy':
            return (
                <svg {...common}>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            );
        case 'nav':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
                </svg>
            );
        case 'right':
            return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
        case 'down':
            return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
        case 'down-arrow':
            return (
                <svg {...common}>
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                </svg>
            );
        case 'check':
            return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>;
        case 'thumb':
            return (
                <svg {...common}>
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7" />
                </svg>
            );
        case 'thumb-down':
            return (
                <svg {...common}>
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17" />
                </svg>
            );
        case 'pin':
            return (
                <svg {...common}>
                    <path d="M12 22s8-7.58 8-13a8 8 0 0 0-16 0c0 5.42 8 13 8 13Z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>
            );
        case 'clock':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            );
        case 'image':
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-5-5L5 21" />
                </svg>
            );
        case 'info':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            );
        case 'baby':
            return (
                <svg {...common}>
                    <path d="M9 12h.01" />
                    <path d="M15 12h.01" />
                    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
                </svg>
            );
        case 'map':
            return (
                <svg {...common}>
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
            );
        case 'more':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                </svg>
            );
        case 'alert':
            return (
                <svg {...common}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            );
        case 'heart':
            return (
                <svg {...common}>
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                </svg>
            );
        case 'home':
            return (
                <svg {...common}>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            );
        case 'route':
            return (
                <svg {...common}>
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                </svg>
            );
        case 'inbox':
            return (
                <svg {...common}>
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
            );
        case 'settings':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            );
        case 'plus':
            return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
        case 'edit':
            return (
                <svg {...common}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
            );
        case 'trash':
            return (
                <svg {...common}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                </svg>
            );
        case 'search':
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.5" y2="16.5" />
                </svg>
            );
        case 'up-arrow':
            return <svg {...common}><path d="m18 15-6-6-6 6" /></svg>;
        case 'bell':
            return (
                <svg {...common}>
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
            );
        case 'user':
            return (
                <svg {...common}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            );
        case 'amen-nurse':
            return (
                <svg {...common}>
                    <path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-5-7s-2-5-2-5-2 3-2 5-3 4-5 7a7 7 0 0 0 7 7z" />
                </svg>
            );
        case 'amen-diaper':
            return (
                <svg {...common}>
                    <path d="M4 8h16l-2 8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3L4 8z" />
                    <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                </svg>
            );
        case 'amen-chair':
            return (
                <svg {...common}>
                    <path d="M7 4h10v9H7z" />
                    <path d="M5 13h14" />
                    <path d="M7 13v7" />
                    <path d="M17 13v7" />
                </svg>
            );
        case 'amen-stroll':
            return (
                <svg {...common}>
                    <circle cx="7" cy="20" r="2" />
                    <circle cx="17" cy="20" r="2" />
                    <path d="M12 5a7 7 0 0 0-7 7v3h14" />
                    <path d="M19 4l-7 8" />
                </svg>
            );
        case 'amen-park':
            return (
                <svg {...common}>
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M8 6v12" />
                    <path d="M8 10h4a2 2 0 0 1 0 4H8" />
                </svg>
            );
        default:
            return null;
    }
};

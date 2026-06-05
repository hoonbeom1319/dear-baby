import { useCallback, useEffect, useState } from 'react';

import { useMediaQuery, useStorageState } from '@/shared/hooks';

import { ADMIN_SIDEBAR_DESKTOP_QUERY, ADMIN_SIDEBAR_EXPANDED_DEFAULT_QUERY } from '../config/sidebar';

type SidebarMode = 'expanded' | 'collapsed';

export function useAdminSidebar() {
    const isDesktop = useMediaQuery(ADMIN_SIDEBAR_DESKTOP_QUERY);
    const isWide = useMediaQuery(ADMIN_SIDEBAR_EXPANDED_DEFAULT_QUERY);
    const [mode, setMode] = useStorageState<SidebarMode | null>('admin-sidebar-mode', null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isCollapsed = isDesktop && (mode !== null ? mode === 'collapsed' : !isWide);

    const toggleCollapsed = useCallback(() => {
        setMode(isCollapsed ? 'expanded' : 'collapsed');
    }, [isCollapsed, setMode]);

    const openMobile = useCallback(() => setMobileOpen(true), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const toggleMobile = useCallback(() => setMobileOpen((open) => !open), []);

    useEffect(() => {
        if (isDesktop) setMobileOpen(false);
    }, [isDesktop]);

    return {
        isDesktop,
        isCollapsed,
        isMobileOpen: mobileOpen,
        toggleCollapsed,
        openMobile,
        closeMobile,
        toggleMobile
    };
}

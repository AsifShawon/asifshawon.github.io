'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import FloatingActions from '../components/FloatingActions';
import Menu from './menu';
import MobileMenu from './mobileMenu';

/**
 * Sticky site header.
 *
 * Everything sits inside the same `Container` the pages use, so the brand on
 * the left and the actions on the right line up with the content below rather
 * than floating on their own margins. The translucent surface only appears
 * once the page has scrolled — at rest the header is invisible, which is what
 * keeps the home page's open feeling intact.
 */
const TopMenu = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <Container className="site-header__inner">
                <Link href="/" className="site-header__brand">
                    Asif Bhuiyan Shawon
                </Link>

                {/* shrink-0: the actions keep their size and the brand wraps
                    instead, which is what keeps 320px free of overflow. */}
                <nav className="flex shrink-0 items-center gap-2 sm:gap-4" aria-label="Main">
                    <div className="hidden lg:block">
                        <Menu variant="header" withBlogMenu />
                    </div>
                    <FloatingActions placement="navbar" />
                    <div className="lg:hidden">
                        <MobileMenu />
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default TopMenu;

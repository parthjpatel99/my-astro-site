import { SITE } from "./consts";

export const SOCIALS = [
    {
        name: "Github",
        href: "https://github.com/parthjpatel99",
        linkTitle: ` ${SITE.title} on Github`,
        icon: "github",
        active: true,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/parthjpatel99",
        linkTitle: `${SITE.title} on LinkedIn`,
        icon: "linkedin",
        active: true,
    },
    {
        name: "Mail",
        href: "mailto:parth8199@gmail.com",
        linkTitle: `Send an email to ${SITE.title}`,
        icon: "mail",
        active: true,
    },
] as const;

export const SHARE_LINKS = [
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/sharing/share-offsite/?url=",
        linkTitle: `Share this post on LinkedIn`,
        icon: "linkedin",
        active: true,
    },
    {
        name: "WhatsApp",
        href: "https://wa.me/?text=",
        linkTitle: `Share this post via WhatsApp`,
        icon: "whatsapp",
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/sharer.php?u=",
        linkTitle: `Share this post on Facebook`,
        icon: "facebook",
    },
    {
        name: "Mail",
        href: "mailto:?subject=See%20this%20post&body=",
        linkTitle: `Share this post via email`,
        icon: "mail",
    },
] as const;

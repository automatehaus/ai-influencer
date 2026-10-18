const paths = {
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  swords: <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 6.5L18 3h3v3l-3.5 8.5M5 14l4 4M7 17l-3 3" />,
  live: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" /></>,
  inbox: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  me: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  bell: <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />,
  back: <path d="M15 18l-6-6 6-6" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  tiktok: <path d="M16 3c.4 2.6 2 4.2 5 4.5v3.2c-1.9 0-3.5-.6-5-1.6V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3z" />,
}

export default function Icon({ name, size }) {
  return (
    <svg viewBox="0 0 24 24" style={size ? { width: size, height: size } : undefined} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

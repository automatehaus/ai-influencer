const initials = h => h.slice(0, 2).toUpperCase()

// Gradient initials until real TikTok avatar URLs come from Login Kit.
export default function Avatar({ c, size = '', showTag = true }) {
  return (
    <div className={`av ${size}${c.live ? ' live' : ''}`} style={{ '--h': c.hue ?? 60 }} aria-hidden="true">
      {initials(c.h)}
      {c.live && showTag && <span className="tag">LIVE</span>}
      {!c.live && c.online && <span className="on" />}
    </div>
  )
}

function Footer() {
  return (
    <footer className="flex items-center justify-between px-12 py-5 border-t border-white/10">
      <p className="text-xs text-white/25">© 2025 Xpose</p>
      <div className="flex gap-5">
        <a href="#" className="text-xs text-white/25 hover:text-white/50 transition">Privacy</a>
        <a href="#" className="text-xs text-white/25 hover:text-white/50 transition">Terms</a>
      </div>
    </footer>
  )
}

export default Footer
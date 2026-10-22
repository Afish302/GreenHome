export default function footer() {
  return (
    <footer className="w-full max-w-md md:max-w-xl py-4 border-t border-slate-200/60 text-center">
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">
            &copy; {new Date().getFullYear()} Green Home | Sustainable Household Intelligence
        </p>
    </footer>
  )
}

export default function DashboardCard({title, children, style = '', className = ''}) {
  return (
    <div className = { 'border border-emerald-300 rounded-xl shadow-md p-3 text-center flex flex-col animate-fade-in-down ' + className } style={style}>
        {title && <h3 className="text-2xl font-semibold text-emerald-400">{title}</h3>}
        {children}
    </div>
  )
}

const stats = [
  { number: "10K+", label: "Verified Creators" },
  { number: "500+", label: "Brand Campaigns" },
  { number: "NPR 2Cr+", label: "Paid Out" },
  { number: "98%", label: "Satisfaction Rate" },
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-blue-600 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-bold text-white">{stat.number}</div>
            <div className="mt-2 text-blue-200 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
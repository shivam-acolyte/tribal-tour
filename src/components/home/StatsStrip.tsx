import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 120, suffix: "+", label: "Destinations" },
  { value: 3000, suffix: "+", label: "Tour Packages" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
];

const StatsStrip = () => (
  <section className="py-16">
    <div className="container-main px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="text-orange">
            <AnimatedCounter target={s.value} suffix={s.suffix} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsStrip;

export const DE_BOOTCAMP = {
  name: "Data Engineering Bootcamp 1.0",
  shortName: "DE Bootcamp 1.0",
  duration: "5 Months",
  price: "₹12,000",
  standardPrice: "₹24,000",
  targetAudience: "Data Analysts looking to upskill, CS graduates",
  prerequisites: "Basic programming logic helps, but starts from scratch",
  techStack: ["Python", "SQL", "AWS S3", "Lambda", "Redshift", "Spark", "Databricks", "Snowflake", "Airflow", "Kafka"],
  projects: [
    { name: "Web Scraper & Serverless", desc: "Real estate data with Python & AWS Lambda" },
    { name: "ETL on 100GB Data", desc: "Processing large datasets using PySpark & AWS Glue" },
    { name: "Real-Time Streaming", desc: "IoT data with Apache Kafka & Spark Streaming" },
    { name: "Enterprise Data Warehouse", desc: "Full EDW with Snowflake, dbt, and Airflow" },
  ],
  stats: {
    projects: "7",
    hours: "290+",
    liveSessions: "24/year",
    internships: "2",
    practiceEnvironments: "∞",
    communityMembers: "1M+",
  },
  weekJourney: [
    { weeks: "1-2", title: "SQL & Python", desc: "Foundations with real business datasets" },
    { weeks: "3-4", title: "AWS & Cloud", desc: "S3, Lambda, ETL pipelines" },
    { weeks: "5-6", title: "Spark & Databricks", desc: "E-commerce pipeline at scale" },
    { weeks: "7-8", title: "Snowflake & Airflow", desc: "Orchestration & data warehouse" },
    { weeks: "9", title: "Production Projects", desc: "Azure, Kafka. Enterprise systems" },
    { weeks: "10", title: "Virtual Internship", desc: "Capstone with Scrum & Jira" },
  ],
  priceComparison: {
    competitors: {
      label: "₹2.5L Bootcamp",
      breakdown: [
        { item: "Sales & Marketing", pct: 45 },
        { item: "Fancy Office", pct: 25 },
        { item: "Generic Videos", pct: 15 },
        { item: '"Career Support"', pct: 10 },
        { item: "Actual Teaching", pct: 5 },
      ]
    },
    padmini: {
      label: "Padmini (₹12K)",
      breakdown: [
        { item: "Content & Platform", pct: 50 },
        { item: "Live Mentoring", pct: 25 },
        { item: "Cloud Infra", pct: 15 },
        { item: "Support & Admin", pct: 10 },
        { item: "Billboard Ads", pct: 0 },
      ]
    }
  },
  differentiators: [
    "100TB+ Data Mindset — beyond 'works on my machine'",
    "Medallion Architecture (Bronze/Silver/Gold)",
    "Tool Fatigue Solution — the right tools, not all tools",
  ],
};

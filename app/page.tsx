import Image from "next/image";
import { ArticleCard } from "@/components/ArticleCard";
import { Pub } from "@/components/Pub";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight inline-block">
            <span className="inline-flex items-center gap-2 rounded-full px-6 py-2 shadow-sm ring-1 ring-black/5 bg-[#FA4616] text-white">
              AI4Counseling Lab
            </span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#research" className="hover:opacity-70">Research</a>
            <a href="#publications" className="hover:opacity-70">Publications</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#0021A5]">
              Yusen Zhai, PhD
            </h1>
            <p className="mt-4 text-neutral-700 text-lg">
              Assistant Professor at University of Florida • Counselor Education • AI & Mental Health
            </p>
            <p className="mt-4 text-neutral-700 max-w-2xl">
              I study how AI can augment counseling and psychotherapy practice and counselor training to improve client mental health and student learning outcomes. My work bridges counseling practice, machine learning, and health policy.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://scholar.google.com/citations?user=g7L_LcsAAAAJ&hl=en"
                className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100"
              >
                Google Scholar
              </a>
              <a
                href="https://www.linkedin.com/in/yusen-zhai-aa9168255"
                aria-label="LinkedIn"
                className="px-3 py-2 rounded-xl border border-neutral-300 inline-flex items-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.56 20.452h3.554V9H3.56v11.452z"/></svg>
              </a>
              <a
                href="https://x.com/YusenZhai"
                aria-label="X"
                className="px-3 py-2 rounded-xl border border-neutral-300 inline-flex items-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#111" aria-hidden="true"><path d="M18.244 2H21l-6.428 7.35L22 22h-6.93l-4.52-6.02L4.5 22H2l6.82-7.8L2 2h6.93l4.19 5.59L18.244 2Zm-2.42 18h2.07L8.29 4H6.22l9.604 16Z"/></svg>
              </a>
            </div>
          </div>

          <div className="justify-self-center md:justify-self-end">
            <div className="relative h-48 w-48 md:h-56 md:w-56 rounded-2xl overflow-hidden shadow-lg ring-1 ring-neutral-200">
              <Image
                src="https://education.ufl.edu/faculty/files/2025/10/Zhai_Headshots_Websize-2.jpg"
                alt="Portrait of Yusen Zhai"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-semibold">About</h2>
          </div>
          <div className="md:col-span-2 space-y-4 leading-relaxed text-neutral-800">
            <p>
              I am a faculty at the University of Florida. I obtained my PhD from the Pennsylvania State University, and I am a Licensed Professional Counselor. I chair the AI Task Force of the Association for Counselor Education and Supervision, as well as the Data-Driven Mental Health Working Group of the American Mental Health Counselors Association. I am also a member of the AI Task Force of the American Counseling Association.
            </p>
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">Research</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleCard
              title="Virtual Client for Counseling Intervention"
              desc="Emotionally realistic agents for high-stakes practice"
              tags={["LLM", "RAG", "Simulation"]}
            />
            <ArticleCard
              title="Virtual Supervisor for Real-time Feedback"
              desc="Augmented learning environment and clinical co-pilot"
              tags={["NLP", "Evaluation", "Education"]}
            />
            <ArticleCard
              title="Health Policy"
              desc="Causal impacts of policy and social determinants on health outcomes"
              tags={["DiD", "Time series analysis", "Public Health"]}
            />
            <ArticleCard
              title="Machine Learning"
              desc="Machine learning for counseling research"
              tags={["Machine learning", "Deep learning", "Analytical method"]}
            />
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">Selected Publications</h2>
          <ul className="mt-6 space-y-4 text-neutral-800">
            <li>
              <Pub
                authors="Zhai, Y., Boitet, L., Soldner, J., Lockman, J., & Du, X."
                year="2025"
                title="Trends in clinically significant anxiety, depression, suicidal ideation, and service utilization among US medical students, 2018-2023"
                venue="BMJ Mental Health"
                link="https://doi.org/10.1136/bmjment-2024-301528"
              />
            </li>
            <li>
              <Pub
                authors="Zhai, Y., Xiong, Y., Almaawali, M., Tian, X., & Du, X."
                year="2025"
                title="National trends of mental health and service utilisation among international students in the United States, 2015–2024"
                venue="General Psychiatry"
                link="https://doi.org/10.1136/gpsych-2025-102124"
              />
            </li>
            <li>
              <Pub
                authors="Beeson, E. T., Zhai, Y., Fulmer, R., Burck, A. M., & Maurya, R."
                year="2025"
                title="A pilot study evaluating the fidelity of ChatGPT in client simulations"
                venue="Journal of Counselor Preparation and Supervision, 19(3), 1-16"
                link="http://dx.doi.org/10.70013/d2a58d79"
              />
            </li>
            <li>
              <Pub
                authors="Zhou, K., Richard, C., Zhai, Y., Li, D., & Fry, H."
                year="2025"
                title="Employment-Related Assistive Technology Needs in Autistic Adults: A Mixed-Methods Study"
                venue="European Journal of Investigation in Health, Psychology and Education, 15(9), 170 (invited submission)"
                link="https://doi.org/10.3390/ejihpe15090170"
              />
            </li>
            <li>
              <Pub
                authors="Zhai, Y., Zhang, Y., Chu, Z., Geng, B., Almaawali, M., Fulmer, R., Lin, Y. W., Xu, Z., Daniels, A. D., Liu, Y., Chen, Q., & Du, X."
                year="2024"
                title="Machine learning predictive models to guide prevention and intervention allocation for anxiety and depressive disorders among college students"
                venue="Journal of Counseling & Development, 103(1), 110-125"
                link="https://doi.org/10.1002/jcad.12543"
              />
            </li>
            <li>
              <Pub
                authors="Zhai, Y., Fan, M., Geng, B., Du, X., Snyder, S., & Wilkinson, L."
                year="2024"
                title="Impact of phased COVID-19 vaccine rollout on anxiety and depression among US adult population, January 2019–February 2023: a population-based interrupted time series analysis"
                venue="The Lancet Regional Health–Americas"
                link="https://doi.org/10.1016/j.lana.2024.100852"
              />
            </li>
            <li>
              <Pub
                authors="Fulmer, R., & Zhai, Y."
                year="2024"
                title="Artificial intelligence in human growth and development: Applications through the lifespan"
                venue="The Family Journal, 33(1), 5-13"
                link="https://doi.org/10.1177/1066480724128233"
              />
            </li>
            <li>
              <Pub
                authors="Zhai, Y., & Du, X."
                year="2024"
                title="Trends in diagnosed posttraumatic stress disorder and acute stress disorder in US college students, 2017-2022"
                venue="JAMA Network Open, 7(5), e2413874"
                link="https://doi.org/10.1001/jamanetworkopen.2024.13874"
              />
            </li>
          </ul>
        </div>
      </section>

      <footer className="py-10 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Yusen Zhai</p>
          <p>
            Built with <a className="underline" href="https://nextjs.org">Next.js</a> &{" "}
            <a className="underline" href="https://tailwindcss.com">Tailwind CSS</a>
          </p>
        </div>
      </footer>
    </main>
  );
}

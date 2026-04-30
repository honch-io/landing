import Navbar from "./components/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

function App() {
  return (
    <div className="min-h-screen text-copy font-landing max-w-7xl mx-auto">
      <Navbar />

      <section className="flex flex-col md:flex-row px-8 pt-20">
        <div className="w-full flex flex-col md:w-1/2 z-50">
          <h1 className="text-6xl font-bold tracking-tight">
            Finally, see how customers use your hardware.
          </h1>

          <p className="text-xl mt-8">
            Product analytics for consumer hardware products. Funnels, cohorts, retention, feature adopton. Built for hardware product managers, not data analysts.
          </p>

          <div className="flex flex-row items-center gap-2 mt-10">
            <button className="cursor-pointer hover:bg-primary/80 transition-colors duration-300 text-lg font-medium flex flex-row items-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-content">
              <span>Get notified</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button className="cursor-pointer transition-colors duration-300 text-lg font-medium flex flex-row items-center gap-2 px-6 py-4 rounded-xl bg-secondary text-secondary-content hover:bg-secondary/80">
              <span>Talk to us</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6 text-lg">
            <span className="text-copy">Already works with your codebase, <span className="marker-underline font-medium">ship same day</span>.</span>
          </div>
        </div>
        <img src="/hero.png" alt="Hero" className="w-full md:w-3/4 absolute -right-30 z-10 overflow-clip" />
      </section>
    </div>
  )
}

export default App

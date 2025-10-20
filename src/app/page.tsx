import Category from "./home/category";
import Hero from "./home/hero";
import Counts from "./shared/counts";
import Solution from "./shared/solution";
import Subscribe from "./shared/subscribe";
import Test from "./shared/test";
import styles from "./page.module.css"

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />

      <div className={styles.head}>
        <h3>Painful Periods? <span>We got you</span></h3>
        <p>Cramps. Mood swings. Leaks. Still expected to perform ? You deserve better support.</p>
      </div>

      <Solution />
      <Counts />
      <Test />
      <Subscribe />
    </div>
  );
}

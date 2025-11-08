import Category from "./home/category";
import Hero from "./home/hero";
import Counts from "./shared/counts";
import Solution from "./shared/solution";
import Subscribe from "./shared/subscribe";
import Test from "./shared/test";
import styles from "./page.module.css"
import Products from "./shared/products";

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <div className={styles.head}>
        <h3>Painful Periods? <span>We got you</span></h3>
        <p>Cramps. Mood swings. Leaks. Still expected to perform ? You deserve better support.</p>
      </div>
      <Products />

      <div className={styles.head}>
        <h3>Offer Sale 20% off</h3>
      </div>
      <Products />

      <Solution />
      <Counts />
      <Test />
      <Subscribe />
    </div>
  );
}

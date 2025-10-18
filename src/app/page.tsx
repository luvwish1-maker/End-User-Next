import Category from "./home/category";
import Hero from "./home/hero";
import Counts from "./shared/counts";
import Solution from "./shared/solution";
import Subscribe from "./shared/subscribe";
import Test from "./shared/test";

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <Solution />
      <Counts />
      <Test />
      <Subscribe />
    </div>
  );
}

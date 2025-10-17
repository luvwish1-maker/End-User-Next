import Category from "./home/category";
import Hero from "./home/hero";
import Counts from "./shared/counts";
import Solution from "./shared/solution";

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <Solution/>
      <Counts/>
    </div>
  );
}

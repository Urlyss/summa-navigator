import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";

const HomePage = () => {
  return (
    <div className="md:p-6 gap-24 flex flex-col break-words">
      <section className="h-fit flex lg:flex-row flex-col gap-10 bg-secondary px-4 py-20">
        <div className="flex-1 space-y-4 flex flex-col justify-center">
          <h1 className="text-4xl text-justify ">
            {`Explore the Depths of Aquinas' Masterpiece.`}
            <br />
            Your Comprehensive Guide to the Summa Theologica.
          </h1>
          <h2 className="text-xl leading-relaxed">
            {`Welcome to the Summa Theologica Explorer, your passport to unlocking the timeless wisdom of Saint Thomas Aquinas. Dive into the depths of one of the most influential works in the history of philosophy and theology, and embark on a journey of discovery unlike any other.

With our intuitive app, navigating the complexities of the Summa Theologica has never been easier. Whether you're a seasoned scholar or a curious seeker, our user-friendly interface and comprehensive tools will empower you to explore, understand, and engage with Aquinas' profound insights like never before.

Join us on this intellectual adventure and uncover the richness of Aquinas' masterpiece. From the existence of God to the nature of virtue, the Summa Theologica awaits your exploration. Start your journey today with the Summa Theologica Explorer.`}
          </h2>
          <div className="flex justify-center items-center">
            <Link
              href={"/explore"}
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              START NOW
            </Link>
          </div>
        </div>
      </section>
      <section className="h-fit flex lg:flex-row flex-col gap-10 px-4 py-20 w-full">
        <div className="flex-1 space-y-4 flex flex-col justify-center">
          <h1 className="text-4xl">
            About the Summa Theologica Navigator
            <br />
            Your Comprehensive Guide to the Summa Theologica.
          </h1>
          <h2 className="text-xl leading-relaxed text-justify">
            {`The Summa Theologica, written by Saint Thomas Aquinas in the 13th century, is a monumental work of theology and philosophy. It is divided into three main parts and addresses a wide range of topics, from the existence of God to the nature of morality. The work is structured in a question-and-answer format, making it a systematic and comprehensive exploration of Christian theology.`}
          </h2>
          <h3 className="text-xl">
            Each part of the Summa Theologica is further divided into treatises,
            questions, and articles:
          </h3>
          <ul className="text-lg text-justify leading-relaxed">
            <li>
              <span className="font-bold">Parts:</span>{" "}
              {`The major divisions of
              the work, each covering broad theological themes.`}
            </li>
            <li>
              <span className="font-bold">Treatises:</span>{" "}
              {`Subsections within
              each part that delve into specific topics.`}
            </li>
            <li>
              <span className="font-bold">Questions:</span>{" "}
              {`Detailed inquiries
              within each treatise that explore particular aspects of the topic.`}
            </li>
            <li>
              <span className="font-bold">Articles:</span>{" "}
              {`The fundamental units
              of the Summa, each presenting a specific issue, objections to the
              issue, counter-arguments, and Aquinas' resolution.`}
            </li>
          </ul>
        </div>
      </section>
      <section className="space-y-4">
        <h1 className="text-4xl">
          How the Summa Theologica Navigator Helps You
        </h1>
        <h2 className="text-xl">
          {`Navigating the vast and intricate structure of the Summa Theologica can be daunting, but the Summa Theologica Navigator app is designed to make this process intuitive and user-friendly. Here's how:`}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 mt-10">
          <div>
            <h1 className="text-3xl">Structured Navigation</h1>
            <h2 className="text-xl leading-relaxed text-justify">
              {`Easily browse through the different parts, treatises, questions, and articles of the Summa.
The app provides a clear hierarchical structure that mirrors the organization of the original text.`}
            </h2>
          </div>
          <div>
            <div className="md:flex justify-between">
              <h1 className="text-3xl">Search Functionality</h1>
            </div>
            <h2 className="text-xl leading-relaxed text-justify">
              {`Quickly find specific topics or terms within the Summa.
Use the search feature to locate particular questions or articles relevant to your interests.`}
            </h2>
          </div>
          <div>
            <div className="md:flex justify-between">
              <h1 className="text-3xl">Thomas AI Assistant</h1>
            </div>
            <h2 className="text-xl leading-relaxed text-justify">
              {`Engage with our AI-powered assistant that helps you understand complex theological concepts. Ask questions, seek clarification, and explore deeper insights with an AI trained on Aquinas' works.`}
            </h2>
          </div>
        </div>
      </section>
      <section className="h-fit flex lg:flex-row flex-col gap-10 bg-secondary px-4 py-20">
        <div className="flex-1 space-y-4 flex flex-col justify-center">
          <h1 className="text-4xl">Meet Thomas AI - Your Theological Guide</h1>
          <h2 className="text-xl leading-relaxed text-justify">
            {`Experience a revolutionary way to study the Summa Theologica with Thomas AI, your personal theological assistant. This advanced AI companion is designed to:`}
          </h2>
          <ul className="text-xl leading-relaxed text-justify list-inside list-disc">
            <li>{`Help clarify complex theological concepts`}</li>
            <li>{`Provide historical context and explanations`}</li>
            <li>{`Guide you through Aquinas' arguments`}</li>
            <li>{`Answer questions about specific articles`}</li>
            <li>{`Offer insights into medieval philosophical thinking`}</li>
          </ul>
          <h2 className="text-xl leading-relaxed text-justify">
{`Whether you're a student, scholar, or enthusiast, Thomas AI makes the profound wisdom of Aquinas more accessible than ever.`}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={"/explore/PtFP-Tr1-Qu1-Ar1?chatOpen=true"}
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Try Thomas AI Now
            </Link>
          </div>
        </div>
      </section>
      <section className="space-y-4 text-center">
        <h1 className="text-3xl">Ready to Explore the Summa Theologica?</h1>
        <h2 className="text-xl leading-relaxed text-justify">
          {`Start your journey with today.`}
          <br />
          {`You've taken the first step in unlocking the treasures of the Summa Theologica. Now, it's time to embark on your journey of discovery. Whether you're seeking deeper understanding, academic study, or spiritual enrichment, the Summa Theologica Navigator is your trusted companion every step of the way.`}
          <br />
          {`Click the button below to begin your exploration of the Summa Theologica with our intuitive and comprehensive app. Start unraveling the mysteries of Aquinas' masterpiece and enrich your understanding of theology and philosophy today!`}
        </h2>
        <div className="flex justify-center items-center">
          <Link
          prefetch
            href={"/explore"}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            START NOW
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import prisma from "@/libs/db";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const latestArticles = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3, // Adjust the number of latest posts you want to fetch
  });

  return (
    <main className=" flex flex-col text-center  px-5 bg-white min-h-screen">
      {/* Hero Section */}
      <Image
        width={300}
        height={300}
        src="/logo.jpeg"
        alt="Action Verticale"
        className=" items-center justify-center mx-auto w-48 my-10  m- h-auto"
      />
      <section className="flex flex-col items-center justify-center h-96 bg-fixed bg-parallax mb-24 bg-cover py-16 text-white font-semibold mx-16 rounded-3xl">
        <p className="text-3xl">Escalade Club La Rivière</p>
        <p className="max-w-[750px] mx-auto leading-8 mt-5 text-2xl">
          Action Verticale est affilié à la Fédération Française de Montagne et
          d’Escalade.
        </p>
      </section>
      {/* Latest Articles Section */}
      <section id="latest-articles" className=" grid  place-items-center p-8">
        <div className="max-w-5xl mx-auto px-4">
          <h6 className="block antialiased tracking-normal font-sans text-[18px] font-bold leading-relaxed text-gray-800 mb-2">
            Derniers articles de blog
          </h6>
          <h1 className="block antialiased tracking-normal font-sans text-[52px] font-bold leading-tight text-gray-900 mb-2">
            Actualités et Évènements
          </h1>
          <p className="block antialiased font-sans mx-auto text-xl font-normal leading-relaxed max-w-3xl mb-36 text-center text-gray-500">
            Découvrez les dernières infos et évènements concernant le club.
            N'hésitez pas à vous abonnez à la newsletter pour recevoir toute
            l'actualité.
          </p>
          <div className="container my-auto grid grid-cols-1 gap-x-16 gap-y-16 items-start lg:grid-cols-3">
            {latestArticles.map((article) => (
              <div
                key={article.id}
                className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md"
              >
                <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-white text-gray-700 shadow-lg -mt-6">
                  <Image
                    width={768}
                    height={768}
                    src="/parallax.jpeg"
                    alt={article.title}
                    className="h-full w-full scale-110 object-cover"
                  />
                </div>
                <div className="p-6 text-start overflow-hidden">
                  <p className="block antialiased font-sans text-sm font-light leading-normal text-blue-500 mb-2 ">
                    Actualitées
                  </p>
                  <Link href={`/posts/${article.id}`}>
                    <h3 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-900">
                      {article.title}
                    </h3>
                  </Link>
                  <div
                    className="overflow-hidden h-20"
                    dangerouslySetInnerHTML={{ __html: article.body }}
                  ></div>
                  <div className="flex items-center gap-4">
                    <Image
                      width={40}
                      height={40}
                      src="/logo.jpeg"
                      alt="Action Verticale"
                      className="inline-block relative object-cover object-center !rounded-full w-9 h-9 rounded-md"
                    />
                    <div>
                      <p className="block antialiased font-sans text-sm font-light leading-normal text-blue-gray-900 mb-0.5 !font-medium">
                        Action Verticale
                      </p>
                      <p className="block antialiased font-sans text-gray-700 text-xs  font-normal">
                        20.01.24
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 mt-16 bg-parallax2 bg-fixed bg-cover mx-16 rounded-3xl "
      >
        <div className="max-w-5xl mx-auto px-4 ">
          <h2 className="text-3xl font-bold mb-6 text-white">
            À propos du club
          </h2>
          <div className="flex flex-row gap-16 items-center justify-center text-white font-semibold text-2xl">
            <div className="flex flex-col">
              <p className="leading-8 text-white mb-6 font-sans font-medium text-start">
                Action Verticale est un club d’escalade qui a pour vocation
                d’offrir aux adhérents la possibilité de découvrir une pratique
                sportive en plein développement.
              </p>
              <p className="leading-8 text-white font-sans font-medium mb-6 text-start">
                L’escalade développe de nombreuses qualités physiques et
                sollicite l’interprétation et l’anticipation pour effectuer les
                bons mouvements. On vous propose de devenir autonome dans la
                pratique de l’escalade dans le respect des règles de sécurité.
                Essentiellement sur structure artificielle mais aussi sur site
                naturel.
              </p>
            </div>
            <Image
              src="/logo.jpeg"
              width={200}
              height={200}
              alt="logo"
              className="rounded-full bg-white"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 bg-blue-400 bg-blend-darken text-white mx-48 my-16 rounded-2xl">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez Action Verticale!
          </h2>
          <p className="leading-8 mb-8">
            Prêt à vous lancer dans l'aventure de l'escalade ? Inscrivez-vous
            dès aujourd'hui et faites le premier pas vers de nouveaux sommets
            avec Action Verticale.
          </p>
          <a
            href="/contact"
            className="px-8 py-4 bg-white text-blue-500 rounded-md text-lg hover:bg-gray-200 transition duration-300"
          >
            Inscrivez-vous maintenant
          </a>
        </div>
      </section>
    </main>
  );
}

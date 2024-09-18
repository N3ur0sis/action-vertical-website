import prisma from '@/libs/db';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Le slug est requis' });
  }

  try {
    const navbarItem = await prisma.navbarItem.findFirst({
      where: {
        route: slug,
        type: 'PAGE',
      },
    });

    if (navbarItem) {
      return res.status(200).json({ exists: true, title: navbarItem.title });
    } else {
      return res.status(200).json({ exists: false }); // Même ici on renvoie une réponse JSON
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la page:", error);
    return res.status(500).json({ error: "Erreur lors de la vérification de la page" });
  }
}

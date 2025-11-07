export default async function handler(req, res) {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();

    if (!data || !data[0]) {
      return res.status(500).json({ error: "No quote found" });
    }

    const { q: quote, a: author } = data[0];
    res.status(200).json({ quote, author });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
}

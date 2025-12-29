export async function GET(_request: Request, { params }: { params: Promise<{ "well-known": string[] }> }) {
  const { "well-known": segments } = await params

  if (
    segments.join("/") === ".well-known/farcaster.json" ||
    segments[0] === "farcaster.json" ||
    (segments[0] === "farcaster" && segments[1] === "json")
  ) {
    const manifest = {
      miniapp: {
        version: "1",
        name: "Base Score",
        homeUrl: "https://v0-base-mini-app-six.vercel.app",
        iconUrl: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
        splashImageUrl: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
        splashBackgroundColor: "#0052FF",
        subtitle: "Track your Base Chain score",
        description:
          "Base Score lets you instantly view your on-chain activity score on the Base network. Track your progress and understand your engagement across the Base ecosystem.",
        screenshotUrls: ["https://v0-base-mini-app-six.vercel.app/base-logo.png"],
        primaryCategory: "finance",
        tags: ["finance", "analytics", "base"],
        heroImageUrl: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
        tagline: "Your Base analytics companion",
        ogTitle: "Base Score – Track Your Base Chain Score",
        ogDescription: "Check your Base Chain activity score instantly and share your progress.",
        ogImageUrl: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
        noindex: false,
      },
      accountAssociation: {
        header:
          "eyJmaWQiOjkwMzI3MywidHlwZSI6ImF1dGgiLCJrZXkiOiIweDcxMjc3NTE2QTE2M2U4QmExYTU3YjgzRjQ0MDQyQTQ3OGM1YTc2NkQifQ",
        payload: "eyJkb21haW4iOiJ2MC1iYXNlLW1pbmktYXBwLXNpeC52ZXJjZWwuYXBwIn0",
        signature: "blYh34HJQREO3XE8bel4+EPcS5d4YwzXDvl/v6d7JFp2o1rUrLs0erVH1P3h4aValwnMqPpPBuLkYRv+CYt5ZBs=",
      },
    }

    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  return new Response("Not Found", { status: 404 })
}

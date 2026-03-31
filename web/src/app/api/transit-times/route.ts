import { NextRequest, NextResponse } from "next/server";

type LatLng = {
  lat: number;
  lng: number;
};

type TransitRequestBody = {
  origin: LatLng;
  destination: LatLng;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_MAPS_API_KEY" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<TransitRequestBody>;

    if (
      !body.origin ||
      !body.destination ||
      typeof body.origin.lat !== "number" ||
      typeof body.origin.lng !== "number" ||
      typeof body.destination.lat !== "number" ||
      typeof body.destination.lng !== "number"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid body. Expected { origin: { lat, lng }, destination: { lat, lng } }",
        },
        { status: 400 }
      );
    }

    //const departureTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const departureTime = "2026-03-31T09:00:00+09:00";

    const googleRes = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.localizedValues",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: body.origin.lat,
                longitude: body.origin.lng,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: body.destination.lat,
                longitude: body.destination.lng,
              },
            },
          },
          travelMode: "TRANSIT",
          //departureTime,
          //languageCode: "en-US",
          //regionCode: "JP",
          //units: "METRIC",
        }),
        cache: "no-store",
      }
    );

    const googleJson = await googleRes.json();

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: "Google Routes API error", details: googleJson },
        { status: googleRes.status }
      );
    }

    const route = googleJson?.routes?.[0];

    console.log("Google response:", googleJson);
    if (!route) {
      return NextResponse.json(
        { error: "No route found", details: googleJson },
        { status: 404 }
      );
    }

    const durationString = route.duration as string | undefined;
    const distanceMeters = route.distanceMeters as number | undefined;
    const localizedDuration =
      route.localizedValues?.duration?.text as string | undefined;
    const localizedDistance =
      route.localizedValues?.distance?.text as string | undefined;

    const seconds = durationString
      ? Number(durationString.replace("s", ""))
      : null;

    const minutes =
      typeof seconds === "number" && !Number.isNaN(seconds)
        ? Math.round(seconds / 60)
        : null;

    return NextResponse.json({
      minutes,
      duration: durationString ?? null,
      distanceMeters: distanceMeters ?? null,
      durationText:
        localizedDuration ?? (minutes !== null ? `${minutes} min` : null),
      distanceText: localizedDistance ?? null,
    });
  } catch (error) {
    console.error("Transit endpoint error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
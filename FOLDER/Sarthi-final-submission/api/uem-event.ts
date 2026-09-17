export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      journeyId,
      eventType,
      latitude,
      longitude,
      battery,
      connectivity,
      lastCheckpoint,
      destination
    } = req.body || {};

    const escalation =
      eventType === "UNEXPECTED_STOP"
        ? "CHECK_IN"
        : eventType === "CHECK_IN_NO_RESPONSE"
        ? "EARLY_AWARENESS"
        : eventType === "ESCALATION_REQUIRED"
        ? "EMERGENCY"
        : "NORMAL";

    return res.status(200).json({
      success: true,
      escalation,
      event: {
        journeyId,
        eventType,
        location: {
          latitude: latitude ?? null,
          longitude: longitude ?? null
        },
        battery: battery ?? null,
        connectivity: connectivity ?? null,
        lastCheckpoint: lastCheckpoint ?? null,
        destination: destination ?? null,
        timestamp: new Date().toISOString()
      }
    });

  } catch {
    return res.status(500).json({
      success: false,
      error: "UEM event processing failed."
    });
  }
}

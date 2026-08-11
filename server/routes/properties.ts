import { Router } from "express";

const router = Router();
const UPSTREAM = "https://properties.redlobosgroup.com/server";

async function upstream(path: string, res: any) {
  try {
    const response = await fetch(`${UPSTREAM}${path}`, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ message: "Upstream property API unavailable" });
  }
}

router.get("/", (_req, res) => upstream("/properties", res));
router.get("/:id", (req, res) => upstream(`/property/${req.params.id}`, res));
router.get("/:id/images", (req, res) => upstream(`/property/${req.params.id}/images`, res));
router.get("/:id/amenities", (req, res) => upstream(`/property/${req.params.id}/amenities`, res));
router.get("/:id/events", (req, res) => upstream(`/property/${req.params.id}/events`, res));

export default router;

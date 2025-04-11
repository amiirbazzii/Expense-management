"use node";

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Get the headers
    const svix_id = request.headers.get("svix-id") || "";
    const svix_timestamp = request.headers.get("svix-timestamp") || "";
    const svix_signature = request.headers.get("svix-signature") || "";

    // If there are no svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", { status: 400 });
    }

    // Get the body as text
    const body = await request.text();

    // Get the webhook secret from environment variable
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      return new Response("Error: Missing webhook secret", { status: 500 });
    }

    // Create a new Svix instance with your secret
    const webhook = new Webhook(secret);

    let event;

    try {
      // Verify the webhook payload
      event = webhook.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Error verifying webhook", { status: 400 });
    }

    // Handle the event
    const eventData = JSON.parse(body);
    const eventType = eventData.type;

    try {
      if (eventType === "user.created") {
        // User was created in Clerk, create user in Convex
        await ctx.runMutation(api.users.createUser, {
          clerkId: eventData.data.id,
          email: eventData.data.email_addresses?.[0]?.email_address,
          firstName: eventData.data.first_name || "",
          lastName: eventData.data.last_name || "",
          imageUrl: eventData.data.image_url || "",
        });
      } else if (eventType === "user.updated") {
        // User was updated in Clerk, update user in Convex
        await ctx.runMutation(api.users.updateUser, {
          clerkId: eventData.data.id,
          email: eventData.data.email_addresses?.[0]?.email_address,
          firstName: eventData.data.first_name || "",
          lastName: eventData.data.last_name || "",
          imageUrl: eventData.data.image_url || "",
        });
      } else if (eventType === "user.deleted") {
        // User was deleted in Clerk, delete user in Convex
        await ctx.runMutation(api.users.deleteUser, {
          clerkId: eventData.data.id,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(`Error processing webhook: ${error}`, { status: 500 });
    }
  }),
});

// Add a path for debugging/checking webhook is alive
http.route({
  path: "/clerk-webhook-check",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(
      JSON.stringify({ status: "active", message: "Webhook endpoint is active" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http; 
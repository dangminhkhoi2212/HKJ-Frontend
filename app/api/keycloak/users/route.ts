import { NextResponse } from "next/server";

import { getAccessToken } from "@/utils";

const keycloakBaseUrl = "http://localhost:9080"; // Replace with your Keycloak server URL
const realmName = "jhipster"; // Replace with your realm name

export async function GET() {
  try {
    const adminAccessToken = await getAccessToken(); // Securely fetch admin token
    console.log("🚀 ~ GET ~ adminAccessToken:", adminAccessToken);
    return NextResponse.json(adminAccessToken);
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    return new NextResponse("Could not fetch users from Keycloak", {
      status: 500,
    });
  }
}

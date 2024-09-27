import axios from "axios";

const keycloakBaseUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL; // Replace with your Keycloak server URL
const realmName = process.env.NEXT_PUBLIC_KEYCLOAK_REALMS; // Replace with your realm name
const adminClientId = "web_app";
const queryString = "sync:false";
type TParams = {
  query?: string;
  page?: number;
  size?: number;
};
const getAdminAccessToken = async () => {
  try {
    const response = await axios.post(
      `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/token?login=false`,
      new URLSearchParams({
        client_id: adminClientId,
        grant_type: "password",
        username: "admin",
        password: "admin",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching admin access token:", error);
    throw new Error("Could not fetch admin access token");
  }
};

// Function to fetch users from Keycloak
const getUsers = async ({ page = 0, size = 10 }: TParams): Promise<any> => {
  try {
    const accessToken = await getAdminAccessToken();
    const response = await axios.get(
      `${keycloakBaseUrl}/admin/realms/${realmName}/users?q=${queryString}&first=${page}&max=${size}&briefRepresentation=false`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    throw new Error("Could not fetch users from Keycloak");
  }
};
const updateUser = async (id: string, data: any): Promise<any> => {
  try {
    const accessToken = await getAdminAccessToken();
    const response = await axios.put(
      `${keycloakBaseUrl}/admin/realms/${realmName}/users/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    throw new Error("Could not fetch users from Keycloak");
  }
};
const getUsersCount = async ({
  page = 0,
  size = 10,
}: TParams): Promise<number> => {
  try {
    const accessToken = await getAdminAccessToken();

    const response = await axios.get(
      `${keycloakBaseUrl}/admin/realms/${realmName}/users/count?q=${queryString}&first=${page}&max=${size}&filterServiceAccountUsers=false`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    throw new Error("Could not fetch users from Keycloak");
  }
};
const getRoleUser = async (id: string): Promise<any> => {
  try {
    const accessToken = await getAdminAccessToken();
    const response = await axios.get(
      `${keycloakBaseUrl}/admin/realms/${realmName}/users/${id}/role-mappings/realm/composite`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    throw new Error("Could not fetch users from Keycloak");
  }
};
const keyCloakService = {
  getUsers,
  updateUser,
  getUsersCount,
  getRoleUser,
};
export default keyCloakService;
